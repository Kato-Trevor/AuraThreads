import { getDislikeCount, getLikeCount } from "@/lib/appwrite/reactions";

/**
 * Calculates the ranking score for responses and sorts them
 * 
 * @param responses - Array of ResponseModel objects to be ranked
 * @returns Sorted array of responses based on the ranking algorithm
 */
export async function rankResponses(responses: ResponseModel[]) {
  // Create a deep copy to avoid modifying the original array
  const scoredResponses = responses.map(async response => {
    // Calculate response type score (R)
    let responseTypeScore = 0;
    switch (response.userId.role.toLowerCase()) {
      case 'counselor':
        responseTypeScore = 5;
        break;
      case 'student': // Assuming 'student' represents peers
        responseTypeScore = 4;
        break;
      case 'ai':
        responseTypeScore = 2;
        break;
      default:
        responseTypeScore = 2; // Default to lowest score if role is unknown
    }

    // For demonstration, let's assume upvotes and downvotes are stored in a separate property
    // In a real implementation, you would get this from your database
    // This is just a placeholder - replace with actual implementation
    const upvotes = await getLikeCount(response.$id || '');
    const downvotes = await getDislikeCount(response.$id || '');
    const netVotes = upvotes - downvotes;

    // Calculate upvote-downvote score (U)
    let upvoteDownvoteScore = 0;
    if (netVotes >= 10) {
      upvoteDownvoteScore = 5;
    } else if (netVotes >= 5) {
      upvoteDownvoteScore = 4;
    } else if (netVotes >= 1) {
      upvoteDownvoteScore = 2;
    } else if (netVotes >= -4) {
      upvoteDownvoteScore = -2;
    } else if (netVotes >= -9) {
      upvoteDownvoteScore = -4;
    }

    // If netVotes <= -10, it should be flagged as toxic
    const isToxic = netVotes <= -10;

    // Calculate recency score (T)
    let recencyScore = 0;
    const createdAt = response.$createdAt ? new Date(response.$createdAt) : new Date();
    const currentTime = new Date();
    const hoursSinceCreation = (currentTime.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
    
    if (hoursSinceCreation < 24) {
      recencyScore = 2;
    } else if (hoursSinceCreation < 24 * 7) {
      recencyScore = 1;
    }

    // Calculate final score using the formula: S = (R × 0.5) + (U × 0.4) + (T × 0.1)
    const finalScore = (responseTypeScore * 0.5) + (upvoteDownvoteScore * 0.4) + (recencyScore * 0.1);

    return {
      response,
      finalScore,
      isToxic,
      createdAt
    };
  });

  // Wait for all promises to resolve and filter out toxic responses
  const resolvedResponses = await Promise.all(scoredResponses);
  const nonToxicResponses = resolvedResponses.filter(item => !item.isToxic);

  // Sort by final score (descending)
  // If two responses have the same score, sort by recency (most recent first)
  nonToxicResponses.sort((a, b) => {
    if (a.finalScore !== b.finalScore) {
      return b.finalScore - a.finalScore;
    }
    // If scores are equal, sort by recency
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  // Return only the response objects, not the scoring information
  return nonToxicResponses.map(item => item.response);
}

export const sortByCreatedAt = (items: any[], order: 'asc' | 'desc' = 'desc') => {
  return [...items].sort((a, b) => {
    const dateA = new Date(a.$createdAt).getTime();
    const dateB = new Date(b.$createdAt).getTime();
    return order === 'desc' ? dateB - dateA : dateA - dateB;
  });
};

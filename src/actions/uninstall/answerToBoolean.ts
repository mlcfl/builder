/**
 * Convert readline answer to boolean value
 */
export const answerToBoolean = (answer: string): boolean => /^(?:y|yes)$/i.test(answer);

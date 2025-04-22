export const getInitials = (name?: string): string => {
    if (!name) return ""; // Handle undefined or empty input
    
    return name.split(' ') // Split the name into words
        .filter(word => word.length > 0) // Remove empty words
        .map(word => word[0].toUpperCase()) // Take the first letter of each word and capitalize it
        .join(''); // Join them together
}

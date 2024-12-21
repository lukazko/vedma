$(document).ready(function () {
    /**
     * Calculates the Levenshtein distance between two strings.
     * @param {string} a - The first string.
     * @param {string} b - The second string.
     * @returns {number} The Levenshtein distance between the two strings.
     */
    function calculateLevenshtein(a, b) {
        const matrix = [];

        // Initialize the matrix with incremental values for the first row and column.
        for (let i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }
        for (let j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }

        // Fill the matrix using the Levenshtein distance formula.
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1]; // No cost for matching characters.
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1, // Substitution cost.
                        matrix[i][j - 1] + 1,     // Insertion cost.
                        matrix[i - 1][j] + 1      // Deletion cost.
                    );
                }
            }
        }

        return matrix[b.length][a.length]; // Return the computed distance.
    }

    /**
     * Cleans a text by removing punctuation and splitting it into words.
     * @param {string} text - The input text to be cleaned and split.
     * @returns {string[]} An array of words from the cleaned text.
     */
    function cleanAndSplit(text) {
        return text.replace(/[.,!?;:]/g, '').split(/\s+/); // Remove punctuation and split by whitespace.
    }

    /**
     * Handles the click event to calculate the total Levenshtein distance word by word.
     * Displays the result in the HTML.
     */
    $('#calculate').click(function () {
        const text1 = $('#text1').val().trim(); // Get and trim the first text input.
        const text2 = $('#text2').val().trim(); // Get and trim the second text input.

        // Validate that both fields have text.
        if (text1 === "" || text2 === "") {
            $('#result').text('Please enter text in both fields.');
            return;
        }

        const words1 = cleanAndSplit(text1); // Clean and split the first text.
        const words2 = cleanAndSplit(text2); // Clean and split the second text.

        const maxLength = Math.max(words1.length, words2.length); // Determine the longer word list.
        let totalDistance = 0; // Initialize total distance.
        const differingWords = []; // Array to store words with differences.

        // Iterate over the words, comparing them pairwise.
        for (let i = 0; i < maxLength; i++) {
            const word1 = words1[i] || ""; // Use an empty string if a word is missing.
            const word2 = words2[i] || "";
            const distance = calculateLevenshtein(word1, word2); // Calculate distance for each word pair.
            totalDistance += distance; // Accumulate the total distance.

            // If the distance is greater than 0, store the differing words and distance.
            if (distance > 0) {
                differingWords.push({ word1, word2, distance });
            }
        }

        // Prepare the result text.
        let resultText = `Total Levenshtein Distance: ${totalDistance}`;

        // If there are differing words, list them with their distances.
        if (differingWords.length > 0) {
            resultText += '<br>Words with differences:<ul>';
            differingWords.forEach(({ word1, word2, distance }) => {
                resultText += `<li>"${word1}" → "${word2}" (distance: ${distance})</li>`;
            });
            resultText += '</ul>';
        } else {
            resultText += '<br>No differing words found.'; // Indicate no differences if applicable.
        }

        $('#result').html(resultText); // Display the result in the output element.
    });
});

"use strict";

// Required dependencies and imports
const readlineSync = require('readline-sync');
const { performance } = require('perf_hooks');
const { exec } = require('child_process');

// Define a print function instead of console.log as per instruction
function print(text) {
    // original: process.stdout.write(text + "\n");
    document.getElementById("terminal").innerHTML += text
}

function generateRandomSentence(wordCount) {
    // Create a list of words
    let words = [
        "monkey", "banana", "jungle", "swing", "playful", "tropical", "primate", "agile", "intelligent", "curious",
        "leap", "forest", "tree", "climb", "adventure", "chatter", "wild", "rainforest", "grape", "cheeky",
        "swift", "banana", "tree", "acrobatic", "jungle", "forage", "quick", "nimble", "dexterous", "fruit",
        "explore", "mischievous", "wander", "leaf", "canopy", "branch", "sunlight", "banana", "nature", "primate",
        "monkey", "banana", "jungle", "swing", "playful", "tropical", "primate", "agile", "intelligent", "curious",
        "leap", "forest", "tree", "climb", "adventure", "chatter", "wild", "rainforest", "grape", "cheeky",
        "swift", "banana", "tree", "acrobatic", "jungle", "forage", "quick", "nimble", "dexterous", "fruit",
        "explore", "mischievous", "wander", "leaf", "canopy", "branch", "sunlight", "banana", "nature", "primate",
        "monkey", "banana", "jungle", "swing", "playful", "tropical", "primate", "agile", "intelligent", "curious"
    ];
    // Shuffle the words array using Fisher-Yates algorithm
    for (let i = words.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = words[i];
        words[i] = words[j];
        words[j] = temp;
    }

    let sentence = "";
    for (let i = 0; i < wordCount; ++i) {
        sentence += words[i % words.length] + " ";
    }
    // Remove the trailing space
    sentence = sentence.slice(0, -1);
    return sentence;
}

function calculateAccuracy(input, sentence) {
    let correctWords = 0;
    let inputWords = [];
    let sentenceWords = [];

    // Make copies of the strings so they can be modified
    let inputCopy = input;
    let sentenceCopy = sentence;

    // Split input into words
    let pos = 0;
    let word = "";
    while ((pos = inputCopy.indexOf(' ')) !== -1) {
        word = inputCopy.substring(0, pos);
        inputWords.push(word);
        inputCopy = inputCopy.substring(pos + 1);
    }
    inputWords.push(inputCopy); // Add the last word

    // Split sentence into words
    pos = 0;
    while ((pos = sentenceCopy.indexOf(' ')) !== -1) {
        word = sentenceCopy.substring(0, pos);
        sentenceWords.push(word);
        sentenceCopy = sentenceCopy.substring(pos + 1);
    }
    sentenceWords.push(sentenceCopy); // Add the last word

    // Compare words
    for (let i = 0; i < Math.min(inputWords.length, sentenceWords.length); ++i) {
        if (inputWords[i] === sentenceWords[i]) {
            ++correctWords;
        }
    }
    return (correctWords / sentenceWords.length) * 100.0;
}

function countErrors(input, sentence) {
    let errors = 0;
    let minLength = Math.min(input.length, sentence.length);

    for (let i = 0; i < minLength; ++i) {
        if (input.charAt(i) !== sentence.charAt(i)) {
            ++errors;
        }
    }

    // Add remaining characters as errors
    errors += Math.abs(input.length - sentence.length);

    return errors;
}

function calculateWPM(elapsedSeconds, wordCount) {
    return (wordCount / elapsedSeconds) * 60.0;
}

function clearClipboard() {
    // Only clear clipboard if running on Windows
    if (process.platform === 'win32') {
        // Use exec to execute the Windows command to clear the clipboard
        exec('echo off| clip');
    }
}

function main() {
    let playAgain;

    do {
        // Welcome message and rules
        print("Welcome to Primatetype!");
        print("Rules:");
        print("1. You will be shown a random sentence.");
        print("2. Type the sentence as quickly as you can.");
        print("3. Your accuracy, words per minute (WPM), and errors will be calculated.");
        print("4. The number of words in the sentence can be selected (between 5 and 100).");
        print("Press Enter to start the test...");
        
        // Wait for the user to press Enter before proceeding
        readlineSync.question("");

        let wordCount;
        
        // Ask user for the word count (between 5 and 100)
        do {
            print("Enter the number of words for the typing test (between 5 and 100): ");
            wordCount = parseInt(readlineSync.question(""));
            if (wordCount < 5 || wordCount > 100 || isNaN(wordCount)) {
                print("Invalid input! Please enter a number between 5 and 100.");
            }
        } while (wordCount < 5 || wordCount > 100 || isNaN(wordCount));

        // Generate the random sentence
        let sentence = generateRandomSentence(wordCount);
        let input = "";
        
        print("\nType the following sentence as quickly as possible:");
        print(sentence);

        clearClipboard();

        print("Click enter to begin");
        readlineSync.question("");
        
        let start = performance.now();
        
        input = readlineSync.question("");

        clearClipboard();

        let end = performance.now();
        let elapsed_seconds = (end - start) / 1000.0;

        let accuracy = calculateAccuracy(input, sentence);
        let wpm = calculateWPM(elapsed_seconds, wordCount);
        let errors = countErrors(input, sentence);

        // Set fixed precision for output values
        print("Time taken: " + elapsed_seconds.toFixed(2) + " seconds");
        print("Accuracy: " + accuracy.toFixed(2) + "%");
        print("Raw words per minute: " + wpm.toFixed(2));
        print("Words per minute: " + (wpm * (accuracy / 100)).toFixed(2));
        print("Errors: " + errors);

        // Ask if the user wants to play again
        print("\nDo you want to play again? (y/n): ");
        playAgain = readlineSync.question("");

        // If they choose 'n', display credits
        if (playAgain === 'n' || playAgain === 'N') {
            print("\nThanks for playing Primatetype!");
            print("Credits:");
            print("Founders: Kaesar Wu, Wilson Wei, Deven Wei");
            print("Sponsor: Ollie Ni");
        }

    } while (playAgain === 'y' || playAgain === 'Y'); // Repeat if user wants to play again

    return 0;
}

// Execute the main function
main();

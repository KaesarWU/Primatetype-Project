#include <iostream>
#include <chrono>
#include <string>
#include <vector>
#include <algorithm>
#include <random>
#include <iomanip> // Include for std::setprecision
#ifdef _WIN32
#include <windows.h>
#endif

std::string generateRandomSentence(int wordCount) {
    std::vector<std::string> words = {
        "monkey", "banana", "jungle", "swing", "playful", "tropical", "primate", "agile", "intelligent", "curious",
        "leap", "forest", "tree", "climb", "adventure", "chatter", "wild", "rainforest", "grape", "cheeky",
        "swift", "banana", "tree", "acrobatic", "jungle", "forage", "quick", "nimble", "dexterous", "fruit",
        "explore", "mischievous", "wander", "leaf", "canopy", "branch", "sunlight", "banana", "nature", "primate",
        "monkey", "banana", "jungle", "swing", "playful", "tropical", "primate", "agile", "intelligent", "curious",
        "leap", "forest", "tree", "climb", "adventure", "chatter", "wild", "rainforest", "grape", "cheeky",
        "swift", "banana", "tree", "acrobatic", "jungle", "forage", "quick", "nimble", "dexterous", "fruit",
        "explore", "mischievous", "wander", "leaf", "canopy", "branch", "sunlight", "banana", "nature", "primate",
        "monkey", "banana", "jungle", "swing", "playful", "tropical", "primate", "agile", "intelligent", "curious"
    };
    std::random_device rd;
    std::mt19937 g(rd());
    std::shuffle(words.begin(), words.end(), g);

    std::string sentence;
    for (int i = 0; i < wordCount; ++i) {
        sentence += words[i % words.size()] + " ";
    }
    sentence.pop_back(); // Remove the trailing space
    return sentence;
}

double calculateAccuracy(const std::string& input, const std::string& sentence) {
    int correctWords = 0;
    std::vector<std::string> inputWords;
    std::vector<std::string> sentenceWords;

    // Make copies of the strings so they can be modified
    std::string inputCopy = input;
    std::string sentenceCopy = sentence;

    // Split input into words
    size_t pos = 0;
    std::string word;
    while ((pos = inputCopy.find(' ')) != std::string::npos) {
        word = inputCopy.substr(0, pos);
        inputWords.push_back(word);
        inputCopy.erase(0, pos + 1);
    }
    inputWords.push_back(inputCopy); // Add the last word

    // Split sentence into words
    pos = 0;
    while ((pos = sentenceCopy.find(' ')) != std::string::npos) {
        word = sentenceCopy.substr(0, pos);
        sentenceWords.push_back(word);
        sentenceCopy.erase(0, pos + 1);
    }
    sentenceWords.push_back(sentenceCopy); // Add the last word

    // Compare words
    for (size_t i = 0; i < std::min(inputWords.size(), sentenceWords.size()); ++i) {
        if (inputWords[i] == sentenceWords[i]) {
            ++correctWords;
        }
    }
    return (static_cast<double>(correctWords) / sentenceWords.size()) * 100.0;
}

int countErrors(const std::string& input, const std::string& sentence) {
    int errors = 0;
    size_t minLength = std::min(input.length(), sentence.length());

    for (size_t i = 0; i < minLength; ++i) {
        if (input[i] != sentence[i]) {
            ++errors;
        }
    }

    // Add remaining characters as errors
    errors += std::abs(static_cast<int>(input.length()) - static_cast<int>(sentence.length()));

    return errors;
}

double calculateWPM(double elapsedSeconds, int wordCount) {
    return (wordCount / elapsedSeconds) * 60.0;
}

void clearClipboard() {
#ifdef _WIN32
    if (OpenClipboard(nullptr)) {
        EmptyClipboard();
        CloseClipboard();
    }
#endif
}

int main() {
    char playAgain;

    do {
        // Welcome message and rules
        std::cout << "Welcome to Primatetype!" << std::endl;
        std::cout << "Rules:\n";
        std::cout << "1. You will be shown a random sentence.\n";
        std::cout << "2. Type the sentence as quickly as you can.\n";
        std::cout << "3. Your accuracy, words per minute (WPM), and errors will be calculated.\n";
        std::cout << "4. The number of words in the sentence can be selected (between 5 and 100).\n";
        std::cout << "Press Enter to start the test...\n";
        
        // Wait for the user to press Enter before proceeding
        std::cin.ignore();

        int wordCount;
        
        // Ask user for the word count (between 5 and 100)
        do {
            std::cout << "Enter the number of words for the typing test (between 5 and 100): ";
            std::cin >> wordCount;
            if (wordCount < 5 || wordCount > 100) {
                std::cout << "Invalid input! Please enter a number between 5 and 100.\n";
            }
        } while (wordCount < 5 || wordCount > 100);

        std::cin.ignore(); // To ignore the newline character left in the buffer from the previous input

        std::string sentence = generateRandomSentence(wordCount);
        std::string input;
        
        std::cout << "\nType the following sentence as quickly as possible:" << std::endl;
        std::cout << sentence << std::endl;

        clearClipboard();

        std::cout << "Click enter to begin\n";
        std::cin.ignore();
        
        auto start = std::chrono::steady_clock::now();
        
        std::getline(std::cin, input);

        clearClipboard();

        auto end = std::chrono::steady_clock::now();
        std::chrono::duration<double> elapsed_seconds = end - start;

        double accuracy = calculateAccuracy(input, sentence);
        double wpm = calculateWPM(elapsed_seconds.count(), wordCount);
        int errors = countErrors(input, sentence);

        std::cout << std::fixed << std::setprecision(2);
        std::cout << "Time taken: " << elapsed_seconds.count() << " seconds" << std::endl;
        std::cout << "Accuracy: " << accuracy << "%" << std::endl;
        std::cout << "Raw words per minute: " << wpm << "\n";
        std::cout << "Words per minute: " << wpm * (accuracy / 100) << std::endl;
        std::cout << "Errors: " << errors << std::endl;

        // Ask if the user wants to play again
        std::cout << "\nDo you want to play again? (y/n): ";
        std::cin >> playAgain;

        // If they choose 'n', display credits
        if (playAgain == 'n' || playAgain == 'N') {
            std::cout << "\nThanks for playing Primatetype!" << std::endl;
            std::cout << "Credits:\n";
            std::cout << "Creators: KaesarWu, wilsonwei123, bbi-dev\n";
            std::cout << "Sponsor: Ollie Ni\n";
        }

    } while (playAgain == 'y' || playAgain == 'Y'); // Repeat if user wants to play again

    return 0;
}

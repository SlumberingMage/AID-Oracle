// Function to build the final question string with nested interpolation
function buildQuestionString(questionsArray) {
    // Helper function to detect circular references in questions
    function detectCircularReferences(questions, visited = new Set()) {
        for (let key in questions) {
            if (visited.has(key)) {
                throw new Error(`Circular reference detected: ${key}`);
            }
            visited.add(key);
            if (typeof questions[key] === 'object') {
                detectCircularReferences(questions[key], visited);
            }
            visited.delete(key);
        }
    }

    // Function to detect cycles and perform topological sorting
    function topologicalSort(questionsArray) {
        const questionMap = new Map(); // To store question prompts by their key
        const dependencyGraph = new Map(); // Graph to represent dependencies
        const indegree = new Map(); // To track number of dependencies per question
        const orderedQuestions = []; // To store the topologically sorted order

        // Helper to extract variable names (dependencies) from the question's prompt
        const extractDependencies = (prompt) => {
            const dependencies = [];
            prompt.replace(/\$(\w+)/g, (match, varName) => {
                dependencies.push(varName);
            });
            return dependencies;
        };

        // Step 1: Build the graph and track indegrees (number of dependencies)
        questionsArray.forEach(question => {
            let [key, prompt] = Object.entries(question)[0];

            // Initialize the graph and indegree count for this question
            if (!dependencyGraph.has(key)) dependencyGraph.set(key, []);
            if (!indegree.has(key)) indegree.set(key, 0);

            // Extract dependencies from the question prompt
            const dependencies = extractDependencies(prompt);

            // For each dependency, create a graph edge and increment indegree of the current question
            dependencies.forEach(dep => {
                if (!dependencyGraph.has(dep)) dependencyGraph.set(dep, []);
                dependencyGraph.get(dep).push(key); // dep -> key (dependency -> current question)
                indegree.set(key, (indegree.get(key) || 0) + 1); // Increment indegree of 'key'
            });

            // Store the question in the map by its key
            questionMap.set(key, prompt);
        });

        // Step 2: Topological Sort (Kahn's Algorithm)
        const queue = [];

        // Add all questions with 0 indegree (no dependencies) to the queue
        indegree.forEach((degree, key) => {
            if (degree === 0) queue.push(key);
        });

        while (queue.length > 0) {
            const current = queue.shift();
            orderedQuestions.push({ [current]: questionMap.get(current) });

            // For each dependent question, decrease its indegree
            if (dependencyGraph.has(current)) {
                dependencyGraph.get(current).forEach(dep => {
                    indegree.set(dep, indegree.get(dep) - 1);
                    if (indegree.get(dep) === 0) queue.push(dep); // If no more dependencies, add to queue
                });
            }
        }

        // If the orderedQuestions array doesn't contain all the questions, there's a cycle
        if (orderedQuestions.length !== questionsArray.length) {
            throw new Error("Cyclical reference detected in questions.");
        }

        return orderedQuestions;
    }
    let questionMap = new Map(); // Store parsed questions
    let finalStrings = []; // Store the final nested questions

    // Check for circular references
    questionsArray.forEach(question => {
        detectCircularReferences(question);
    });

    // Iterate over questions and build the strings
    topologicalSort(questionsArray).forEach(question => {
        let [key, prompt] = Object.entries(question)[0];

        // Check if the prompt contains references to other questions
        let nestedPrompt = prompt.replace(/\$(\w+)/g, (_, varName) => {
            if (questionMap.has(varName)) {
                return `\${${questionMap.get(varName)}}`; // Insert previous question if found
            } else {
                throw new Error(`Reference ${varName} not found for key ${key}`);
            }
        });

        // Save the question prompt into the map
        questionMap.set(key, nestedPrompt);
        finalStrings.push({ key, value: `\$\{${nestedPrompt}\}` });
    });

    return finalStrings.reverse();
}
module.exports = { buildQuestionString }

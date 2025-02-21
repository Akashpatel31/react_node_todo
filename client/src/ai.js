import * as tf from '@tensorflow/tfjs';

// Helper function to prepare data: convert todo text length and completion status
export const prepareData = (todos) => {
    if (!todos || !Array.isArray(todos)) {
      console.error('Invalid todos data:', todos);
      return [];
    }
    // Ensure each todo is transformed into a 2D array of features (e.g., text length and completion status)
    return todos.map(todo => {
      return [todo.text.length, todo.completed ? 1 : 0];  // Text length and completion status as features
    });
  };
  

  export const trainModel = async (todos) => {
    const xs = tf.tensor2d(prepareData(todos));  // Features: text length and completion status
    const ys = tf.tensor2d(todos.map(todo => [todo.completed ? 1 : 0]));  // Labels: completion status (1 or 0)
  
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 10, activation: 'relu', inputShape: [2] }));  // Input has 2 features: text length and completion status
    model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));
  
    model.compile({ optimizer: 'adam', loss: 'binaryCrossentropy', metrics: ['accuracy'] });
  
    await model.fit(xs, ys, { epochs: 10 });
    return model;
  };
  

// Predict next tasks based on the trained model
export const predictTasks = async (model, todos) => {
    const xs = tf.tensor2d(prepareData(todos));  // Prepare the input data
    const predictions = model.predict(xs);
    const predictedValues = await predictions.data();  // Get the prediction values

    // Log predicted values for debugging
    console.log("Predicted Values: ", predictedValues);

    // Filter tasks based on predicted probability (tasks predicted to be uncompleted)
    const filteredTodos = todos.filter((todo, index) => {
        return predictedValues[index] < 0.5 && !todo.completed;
    });

    // Sort tasks based on predicted probability (higher value = higher priority)
    const sortedTodos = filteredTodos.sort((a, b) => {
        const aIndex = todos.indexOf(a);
        const bIndex = todos.indexOf(b);
        return predictedValues[bIndex] - predictedValues[aIndex];  // Sort in descending order
    });

    console.log("Sorted Tasks: ", sortedTodos);  // Log sorted tasks for debugging

    // Return the most relevant task (the one with the highest predicted value)
    return sortedTodos.length > 0 ? sortedTodos[0] : null;
};

  
  
  

import * as tf from '@tensorflow/tfjs';

// Placeholder function to prepare training data
const prepareData = (todos) => {
  return todos.map(todo => [todo.completed ? 1 : 0]);
};

// Train a simple model
export const trainModel = async (todos) => {
  const xs = tf.tensor2d(prepareData(todos));
  const ys = tf.tensor2d(todos.map(todo => [todo.completed ? 0 : 1]));

  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 10, activation: 'relu', inputShape: [1] }));
  model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

  model.compile({ optimizer: 'adam', loss: 'binaryCrossentropy', metrics: ['accuracy'] });

  await model.fit(xs, ys, { epochs: 10 });
  return model;
};

// Predict next tasks
export const predictTasks = async (model, todos) => {
  const xs = tf.tensor2d(prepareData(todos));
  const predictions = model.predict(xs);
  const predictedValues = await predictions.data();

  return todos.filter((todo, index) => predictedValues[index] > 0.5);
};

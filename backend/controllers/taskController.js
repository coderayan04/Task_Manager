const asyncHandler = require('express-async-handler')
const Task = require('../models/taskModel')

// get all task of specific user
const getTasks = asyncHandler(async(req, res) => {
  if (!req.user) {
    res.status(400)
    throw new Error('User not found')
  }
  const {priority} = req.body;
  console.log(priority);
  const {id} = req.user;
  if(priority === 'low' ){
    console.log('1')
    console.log('User ID:', id);
    const tasks = await Task.find({ user: id, priority: 'low' });
    res.status(200).json(tasks);
  }else if(priority === 'medium'){
    const tasks = await Task.find({ user: id, priority: 'medium' });
    res.status(200).json(tasks);
  } else if(priority === 'high'){
    const tasks = await Task.find({ user: id, priority: 'high' });
    res.status(200).json(tasks);
  }else{
    const tasks = await Task.find({user: req.user.id})
    res.status(200).json(tasks)
  }

})

// get specific task for specific user
const getTask = asyncHandler(async(req, res) => {
  const task = await Task.findById(req.params.id)
  if (!req.user) {
    res.status(400)
    throw new Error('User not found')
  }

  res.status(200).json(task)
})

// create a new task
const createTask = asyncHandler(async(req, res) => {
  const {taskItem, priority, taskCompleted, favorite} = req.body

  if (!taskItem || !priority) {
    res.status(400)
    throw new Error('Please fill all required fields')
  } else {
    const task = await Task.create({user:req.user.id, taskItem, priority, taskCompleted, favorite})
    res.status(201).json(task)
  }
})

// upadte task or task status
const updateTask = asyncHandler(async(req, res) => {
  const task = await Task.findById(req.params.id)

  if (!task) {
    res.status(404)
    throw new Error('Task not found')
  }

  if (!req.user) {
    res.status(401)
    throw new Error('User not found')
  }

  if (task.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('Not authoraized')
  }

  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true})

  res.status(200).json(updatedTask)
})

//delete task
const deleteTask = asyncHandler(async(req, res) => {
  const task = await Task.findById(req.params.id)

  if (!task) {
    res.status(400)
    throw new Error('Task not found')
  }

  if (!req.user) {
    res.status(401)
    throw new Error('User not found')
  }

  if (task.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('Not authoraized')
  }

  await Task.deleteOne(task)

  res.status(200).json({id: task._id})
})






module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} 
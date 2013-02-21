// opening and closing a connection
var mongoose = require('mongoose')
  , db = mongoose.connect('mongodb://localhost/tasks');

  mongoose.disconnect();

// registering a schema
var Schema = mongoose.Schema;
var Tasks = new Schema({
  project: String,
  description: String
});
mongoose.model('Task', Tasks);

// adding a task
var Task = mongoose.model('Task');
var task = new Task();
task.project = 'Bikeshed';
task.description = 'Paint the bikeshed red.';
task.save(function(err) {
  if (err) throw err;
  console.log('Task saved.');
});

// searching for a task
var Task = mongoose.model('Task');
Task.find({'project': 'Bikeshed'}).each(function(err, task) {
  if (task != null) {
    console.log('ID:' + task._id);
    console.log(task.description);
} });

// updating a document
var Task = mongoose.model('Task');
Task.update(
  {_id: '4e65b793d0cf5ca508000001'},
  {description: 'Paint the bikeshed green.'},
  {multi: false},
  function(err, rows_updated) {
    if (err) throw err;
      console.log('Updated.');
  }
);

// removing a document
var Task = mongoose.model('Task');
Task.findById('4e65b3dce1592f7d08000001', function(err, task) {
  task.remove();
});
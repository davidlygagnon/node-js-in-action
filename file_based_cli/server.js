var fs = require('fs'),
  path = require('path'),
  args = process.argv.splice(2),
  command = args.shift(),
  taskDescription = args.join(' '),
  file = path.join(process.cwd(), '/.tasks');

switch (command) {
  case: 'list':
    listTasks(file)
    break;

  case 'add':
    addTask(file, taskDescription);
    break;

  default:
    console.log('Usage' : + process.argv[0]
      + ' list|add [taskDescription]');
}

function

const { remote } = require('electron')

const fs = require('fs');

const notifier = require('node-notifier');

function getId(Id) {return document.getElementById(Id);}

var help = getId('help');
var notification = getId('notification');
var error = getId('error');

notifier.notify({
    title: 'Planifier',
    message: 'Welcome back !',
});

function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    var m_ = today.getMonth();
    var d_ = today.getDate();
    var y_ = today.getFullYear();
    var year = y_.toString();
    m = checkTime(m);
    var months_ = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Nov","Dec"]
    document.getElementById('date').innerHTML =
    h + ":" + m + " - " + " " + months_[Number(m_)] + " " + d_ + " " + "'" + year.slice(2,4);
    var t = setTimeout(startTime, 500);
}

function checkTime(i) {
    if (i < 10) {i = "0" + i};
    return i;
}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) 
    {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function get_task_date(getstring) {
    var str = getstring;
    var rem = str.split("\n")
    return rem[0];
}

function get_task_val(getstring) {
    var str = getstring;
    var rem = str.split("\n")
    return rem[2];
}

document.onreadystatechange = () => {
    const screen = remote.getCurrentWindow();
    if (document.readyState == "complete") {
        screen.on('maximize', toggleMaxRestoreButtons);
        screen.on('unmaximize', toggleMaxRestoreButtons);
    }
};

function toggleMaxRestoreButtons() {
    var screen = remote.getCurrentWindow();
    if (screen.isMaximized()) {
        getId("maximize").innerHTML = "&#xE923";
    }
    else{
        getId("maximize").innerHTML = "&#xE922";
    }
}

function alert_box(message) {
    getId('create_task').style.display = "none";
    getId("alert_").style.display = "block";
    getId("alert_").className = "show"; 
    getId("alert_label").value = message;
    getId('inframe').className = "disabler";
    getId('alert_ok').onclick = function() {
        getId('inframe').className = "enabler";
        getId('alert_').style.display = "none";
    }
    notifier.notify({
        title: 'Planifier',
        message: message,
    });
}

function titlebar_() {
	  if (remote.BrowserWindow.getFocusedWindow().maximize() == false){
		  remote.BrowserWindow.getFocusedWindow().maximize();
	}
}

function minimize_() {
    remote.getCurrentWindow().minimize();
}

function maximize_() {
    var window = remote.BrowserWindow.getFocusedWindow();
    window.isMaximized() ? window.unmaximize() : window.maximize();
    if (window.isMaximized()) {
    	getId("maximize").innerHTML = "&#xE923";
    }
    else{
    	getId("maximize").innerHTML = "&#xE922";
    }
}

function exit_() {
    remote.getCurrentWindow().close()
}

function createWindow() {
    getId('create_task').style.display = (getId('create_task').style.display == 'block') ? 'none' : 'block';
    getId('pop_up_block').value = "";
    getId('edit_task').style.display = "none";
    getId('rmenu').style.display = "none";
}

function editWindow() {
    getId('edit_task').style.display = (getId('edit_task').style.display == 'block') ? 'none' : 'block';
    getId('_pop_up_block').value = "";
}

function createHelp() {
    alert_box("To edit a card : right click on Task card and press edit\nTo delete a card : right click on Task card and press delete\nTo create a card : click 'Create Task >>\nIf task completed double click on it")
}

function task_completed(thisid) {
    notification.play();
    getId('task_complete').style.display = "block";
    getId('inframe').className = "disabler";
    getId('complete_pop_up_block').value = "Have you Completed this task ?"
    getId('done_task').onclick = function() {
        getId('task_complete').style.display = "none";
        getId(thisid).style.display = "none";
        getId('inframe').className = "enabler";
        notifier.notify({
            title: "Planifier",
            message : "Well Done !\nTask completed.👍"
        });
    }
    getId('not_done').onclick = function() {
        getId('task_complete').style.display = "none";
        getId('inframe').className = "enabler";
    }
}

function rightclick(thisid) {
    getId('create_task').style.display = "none";
    getId("rmenu").style.display = "block";
    getId("rmenu").className = "show"; 
    getId('inframe').className = "disabler";
    getId('del').onclick = function() {
        getId('rmenu').style.display = (getId('rmenu').style.display == 'block') ? 'none' : 'block';
        getId('edit_task').style.display ="none";
        getId('create_task').style.display = "none";
        getId('rmenu').style.display = "none"
        getId('task_complete').style.display = "block";
        getId('inframe').className = "disabler";
        getId('complete_pop_up_block').value = "Do want to delete this task ?"
        getId('done_task').onclick = function() {
            getId('task_complete').style.display = "none";
            getId(thisid).style.display = "none";
            getId('inframe').className = "enabler";
            notifier.notify({
                title: "Planifier",
                message : "Task deleted"
            });
        }
        getId('not_done').onclick = function() {
            getId('task_complete').style.display = "none";
            getId('inframe').className = "enabler";
            getId('rmenu').style.display = "none"
            getId('edit_task').style.display ="none";
        }
    }
    getId('close_context').onclick = function() {
        getId('create_task').style.display = "none";
        getId('rmenu').style.display = "none";
        getId('inframe').className = "enabler";
    }
    getId('edit').onclick = function() {
        getId('create_task').style.display = "none";
        getId('edit_task').style.display = "block";
        getId("edit_task").className = "show_edit";
        getId('rmenu').style.display = "none";
        getId('_pop_up_block').value = get_task_val(getId(thisid).innerHTML);
        getId('_close_').onclick = function() {
            getId('edit_task').style.display = (getId('edit_task').style.display == 'block') ? 'none' : 'block';
            getId('inframe').className = "enabler";
        }
        document.getElementById('edit_').onclick = function edit_task_details() {
            var edited_value = get_task_date(getId(thisid).value) + "\n\n" + getId('_pop_up_block').value;

            if (getId('_pop_up_block').value == "")
            {
              notification.play();
              alert_box("Task details cannot be empty !");
              getId('edit_task').style.display = "none";
            }
            else
            {
              getId('edit_task').style.display = (getId('edit_task').style.display == 'block') ? 'none' : 'block';
              getId(thisid).value = edited_value;
              getId('_pop_up_block').value = "";
              getId('inframe').className = "enabler";
            }
        }
    }
}

function get_task_details() {
    var value_ = getId("date").innerHTML + "\n\n" + getId('pop_up_block').value;
    if (getId('pop_up_block').value == "")
    {
        notification.play();
        alert_box("Task details cannot be empty !")
        getId('create_task').style.display = "none";
    }
    else
    {
        id_ = makeid(6)
        getId('create_task').style.display = (getId('create_task').style.display == 'block') ? 'none' : 'block';
        var new_task = getId('task').appendChild(document.createElement('textarea'));
        new_task.appendChild(document.createTextNode(value_));
        new_task.setAttribute("class","task_val");
        new_task.setAttribute("id", id_);
        new_task.setAttribute('readonly',"true");
        new_task.setAttribute("oncontextmenu","rightclick(this.id);");
        new_task.setAttribute("ondblclick","task_completed(this.id)");
    }
}


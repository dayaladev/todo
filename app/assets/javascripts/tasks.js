  $(function(){
    // The taskHtml method takes in a JavaScript representation 
    // of the task and produces an HTML representation using 
    // <li> tags
    function taskHtml(task) {
      var checkedStatus = task.done ? "checked" : "";
      var liClass = task.done ? "completed" : "";
      var liElement = '<li id="listItem-' + task.id + '" class="' + liClass + '">' + 
        '<div class="view"><input class="toggle" type="checkbox"' + 
        " data-id='" + task.id + "'" + 
        checkedStatus + 
        '><label>' + 
        task.title + 
        '</label></div></li>';
      return liElement;
    }
    // toggleTask takes in a n HTML representation of 
    // an event that firs from an HTML representation of 
    // the toggle checkbox and performs an API request to toggle 
    // the value of the 'done' field
    function toggleTask(e) {
      var itemId = $(e.target).data("id");
      // console.log(itemId);
      var doneValue =  Boolean($(e.target).is(':checked'));
      // console.log("done:", doneValue);
      $.post("/tasks/" + itemId, {
        _method: "PUT",
        task: {
          done: doneValue
        }
      }).success(function(data) {
        var liHtml = taskHtml(data);
        var $li = $("#listItem-" + data.id)
        $li.replaceWith(liHtml);
        $('.toggle').change(toggleTask);
      });
    }
    $.get("/tasks").success( function( data ) {
      var htmlString = "";
      $.each(data, function(index, task) {
        // var checkedStatus = task.done ? "checked" : "";
        // var liElement = '<li><div class="view"><input class="toggle" type="checkbox"' +
        // " data-id='" + task.id + "'" +
        // checkedStatus +
        // '><label>' +  
        // task.title +
        // '</label></div></li>';
        // htmlString += liElement;
        htmlString += taskHtml(task);
      });
      var ulTodos = $('.todo-list');
      ulTodos.html(htmlString);

      //$('.toggle').change(function() {
      //  console.log("Toggle!");
      //});
      // $('.toggle').change(function(e) {
      //   var itemId = $(e.target).data("id");
      //   console.log(itemId);
      //   var doneValue = Boolean($(e.target).is(':checked'));
      //   console.log("done:", doneValue);
      //   $.post("/tasks/" + itemId, {
      //     _method: "PUT",
      //     task: {
      //       done: doneValue
      //    }
      //   });
      // });
      $('.toggle').change(toggleTask);
    });
    $('#new-form').submit(function(event) {
      event.preventDefault();
      // console.log("intercepted.");
      var textbox = $('.new-todo');
      var payload = {
        task: {
          title: textbox.val()
        }
      };
      // console.log("Task: ", textbox.val());
      $.post("/tasks", payload).success(function(data) {
        var htmlString = taskHtml(data);
        // console.log(data);
        // console.log(htmlString);
        var ulTodos = $('.todo-list');
        ulTodos.append(htmlString);
        // $('.toggle').change(toggleTask);
        $('.toggle').click(toggleTask);
        $('.new-todo').val('');
      });
    });
  });
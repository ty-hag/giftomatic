console.log('ajax file loaded');

$('#add-comment-form').submit(function(e){
    e.preventDefault();
    
    var actionUrl = $(this).attr('action');
    var formData = $(this).serialize();
    console.log(formData);
    
    $.ajax({
        url: actionUrl,
        data: formData,
        type: 'POST',
        dataType: 'json',
        success: function(data){
            console.log('returned json:', data);
            
            $('#comment-list').append(
                `
                <div>${data.text}<div>
                `)
        }    
    });
});
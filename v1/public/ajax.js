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
            $('#add-comment-form textarea').val('');
        }    
    });
});

$('#show-item-form').on('click', function(){
    if($('#new-item-form').css('display') === 'none'){
        $('#new-item-form').toggle();
    }
});

$('#close-add-item').on('click', function(){
    $('#new-item-form input').val('');
    $('#new-item-form').toggle();
})

$('#new-item-form').submit(function(e){
    e.preventDefault();
    
    var actionUrl = $(this).attr('action');
    var formData = $(this).serialize();
    $.ajax({
        url: actionUrl,
        data: formData,
        type: 'POST',
        dataType: 'json',
        success: function(item){
            $('#wishlist').append(
                `
<a class="item-link" href="/items/${item._id}">
    <div class="wishlist-item">
        <div class="wishlist-title">
            ${item.name}
        </div>
        <span>${item.price}</span>
        <span class="purchaseStatus ${item.purchaseStatus}">${item.purchaseStatus}</span>
    </div>
</a>
            `)
           //$('#new-item-form').toggle();
            $('#new-item-form input').val('');
        }
    })
})
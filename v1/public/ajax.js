console.log('ajax file loaded');

//-------------- ITEM PAGE-----------------

//set purchase status with respect to buttons
$(document).ready(function(){
    if($('#purchase-status-value').val()){
        let purchaseStatus = $('#purchase-status-value').val();
        $('.selected').toggleClass('selected');
        $(`#${purchaseStatus.toLowerCase()}`).toggleClass('selected');
    }
})

$('.item-status-button').on('click', function(e){
    e.preventDefault();
    
    $('.selected').toggleClass('selected');
    $(this).toggleClass('selected');
    
    let newStatus = $(this).html();
    let actionUrl = $('#item-status-form').attr('action');
    
    $.ajax({
        url: actionUrl,
        data: {purchaseStatus: newStatus},
        type: 'PUT',
        success: function(data){
            console.log('Item status updated!');
            console.log(data)
            if(data.claimedBy === undefined){
                $('#claimed-by').html('');
            } else {
                console.log('hey');
                $('#claimed-by').html(`${data.purchaseStatus} by ${data.claimedBy.firstName} ${data.claimedBy.lastName}`);
            }
        }
    })
});

// $('.item-status-button').on('mouseout', function(){
//     $(this).on('hover', function(){
//         $(this).css('background-color', '#c8c8c8');
//     });
// });

$('#add-comment-form').submit(function(e){
    e.preventDefault();
    
    console.log("Comment form submitted!");
    
    var actionUrl = $(this).attr('action');
    var formData = $(this).serialize();
    console.log(formData);
    
    $.ajax({
        url: actionUrl,
        data: formData,
        type: 'POST',
        dataType: 'json',
        success: function(data){
            console.log('SUCCESS!')
            var timestamp = new Date(data.createdAt).toLocaleDateString('en-US');
            console.log('timestamps \n', timestamp);
            $('#comment-list').append(
                `
                <div class='show-item-comment'>
                    <pre>${data.text}</pre>
                    <div class='comment-author'> - ${data.author.firstName} ${data.author.lastName}, ${timestamp}</div>
                </div>
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

//-------------- LIST PAGE -------------------
// Add new item form
$('#new-item-form').submit(function(e){
    e.preventDefault();
    
    var user_id = $('#user_id').attr('class');
    var list_id = $('#list_id').attr('class');
    
    var actionUrl = $(this).attr('action');
    var formData = $(this).serialize();
    $.ajax({
        url: actionUrl,
        data: formData,
        type: 'POST',
        dataType: 'json',
        //fix href below to match new routing, need to get userid in somehow
        //perhaps in some element's attribute
        success: function(item){ 
            $('#wishlist').append(
                `
<a class="item-link" href="/user/${user_id}/lists/${list_id}/items/${item._id}">
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
            $('#new-item-form textarea').val('');
        }
    })
})
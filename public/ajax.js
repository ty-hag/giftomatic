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

// update purchase status on click
$('.item-status-button').on('click', function(e){
    e.preventDefault();

    if($('#current-user').val() === $('#claimed-by-data').val() || $('#claimed-by-data').val() === 'undefined'){
        let clickedButton = $(this);
        let newStatus = $(this).html();
        let actionUrl = $('#item-status-form').attr('action');

        $.ajax({
            url: actionUrl,
            data: {purchaseStatus: newStatus},
            type: 'PUT',
            success: function(data){
                console.log(data);
                if(data.cantClaim === true){
                    // Handle DOM update - someone claimed while user was viewing item
                    $(".error-message").html("Someone else has just claimed this item. Refresh your page to see the update.");
                } else {
                    if(data.claimedBy === undefined){
                        // Update DOM for user relinquishing claim
                        $('#claimed-by-data').val('undefined');
                        $('#claimed-by').html(``);
                    } else {
                        // Update DOM for new claim/purchase
                        $('#claimed-by').html(`${data.purchaseStatus} by ${data.claimedBy.firstName} ${data.claimedBy.lastName}`);
                    }
                    // Update button highlight
                    $('.selected').toggleClass('selected');
                    clickedButton.toggleClass('selected');
                }
            }
        })
    } else {
        $(".error-message").html("Someone else has claimed this item!");
    }
});


// add comment
$('#add-comment-form').submit(function(e){
    e.preventDefault();
    
    if($('textarea').val() === ''){
        return;
    }
    
    var actionUrl = $(this).attr('action');
    var formData = $(this).serialize();
    console.log('formData: \n', formData);
    
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
    
    var user_id = $('#user_id').attr('data');
    var list_id = $('#list_id').attr('data');
    
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

<div class="wishlist-item">
    <div class="wishlist-title">
        ${item.name}
    </div>
    <span>${item.price}</span>
    <span class="purchaseStatus ${item.purchaseStatus}">${item.purchaseStatus}</span>
    
    <form id="delete-button-form" action="/user/${user_id}/lists/${list_id}/items/${item._id}?_method=DELETE" method="POST">
        <button class='btn-delete'>Delete item</button>
    </form>
    
</div>
            `)
           //$('#new-item-form').toggle();
            $('#new-item-form input').val('');
            $('#new-item-form textarea').val('');
        }
    })
})
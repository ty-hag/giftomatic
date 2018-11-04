console.log('ajax file loaded');

//-------------- ITEM PAGE-----------------

// update purchase status on click
$('.item-status-button').on('click', function(e){
    e.preventDefault();

    // Check if item unclaimed or user is person who claimed item
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
        // Handle person 
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

//-------------- SEARCH PAGE -------------------
//
$(".send-friend-invite").on('click', function(){
    let $clicked = $(this);
    let $clickedParent = $clicked.parent();
    let routeUrl = $clicked.attr("data-route");
    $.ajax({
        url: routeUrl,
        type: 'GET',
        success: function(item){
            if(item.rejected){
                console.log('REJECTED!');
                $clicked.remove();
                $clickedParent.append(' - Invitation failed. This user may have already sent you an invite.');
            } else {
                console.log(item);
                $clicked.remove();
                $clickedParent.append(' - Invitation sent!');
            }
        }
    })
})

//-------------- INVITATION PAGE -------------------

// Handle accept button press
$("#invite-accept").on('click', function(){
    let answerData = {answer: "accept"};
    console.log('answerData:\n', answerData);
    let $clickedInvitation = $(this).parent();

    // put together route for request
    let routeUrl = $(this).parent().attr('data-answer-url');
    console.log("routeUrl\n", routeUrl);
    $.ajax(
        {
            url: routeUrl,
            data: answerData,
            type: 'POST',
            dataType: 'json',
            success: function(receivedData){
                console.log(receivedData);
                $clickedInvitation.html("Invitation accepted!");
            }
        }
    )
})

// Handle reject button press (mostly the same as accept, may want to refactor later)
$("#invite-delete").on('click', function(){
    let answerData = {answer: 'reject'};
    console.log('answerData:\n', answerData);
    let $clickedInvitation = $(this).parent();

    // put together route for request
    let routeUrl = $(this).parent().attr('data-answer-url');
    console.log("routeUrl\n", routeUrl);
    $.ajax(
        {
            url: routeUrl,
            data: answerData,
            type: 'POST',
            dataType: 'json',
            success: function(receivedData){
                console.log(receivedData);
                $clickedInvitation.html("Invitation rejected!");
            }
        }
    )
})

// ------------------ EXCHANGE PAGE ----------------------
$('.notes-update').on('click', function(){
    let $clickedExchangeDiv = $(this).parent();
    let sendData = {};
    sendData.pairId = $(this).attr('data-pair-id');
    sendData.notes = $(this).parent().children('textarea').val();

    let routeUrl = $(this).attr('data-url');

    $.ajax(
        {
            url: routeUrl,
            data: sendData,
            type: "POST",
            dataType: 'json',
            success: function(responseData){
                console.log(responseData);
                console.log($clickedExchangeDiv);
                $clickedExchangeDiv.children('.msg-send-confirm').html('Notes updated!');
            }
        }
    )
});

$('.pairing-status-update').on('click', function(){
    // Update pairing's gift purchase status in DB
    console.log("Pairing status update clicked.");
    let $clickedButton =$(this);
    let $clickedPairingDiv = $(this).parent();
    let routeUrl = $(this).attr('data-url');
    console.log($(this).attr('data-url')); 

    $.ajax(
        {
            url: routeUrl,
            type: "PUT",
            success: function(responseData){
                $clickedButton.html(responseData.buttonText);
                $clickedPairingDiv.children('.pairing-status').html(responseData.htmlText);
            }
        }
    )
    // TODO: Change status on page
    console.log("clicked");
});
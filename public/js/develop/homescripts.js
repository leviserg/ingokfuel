let updatePeriod = 12; // sec

$(document).ready(function(){
    let dt = setInterval("getCurData()", updatePeriod*1000);
    getCurData();
    $('#pagetitle').text('Участки');
});

function getCurData(){
    let prdir = $('#prdir').text();
    $.ajax({
        type:'GET',
        // url: '../app/core/Routes.php/',
        url: '../'+prdir+'app/ajax/ajaxroutes.php/',
        data: { homecurdata : true },
        cache: false,
        crossDomain: true,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data){
            //console.log(data);
            showPageContent(data);
        },
        error: function(err){
            console.log(err);
        }
    });
}


    // ------------- FOR ELEVATOR ----- DO NOT REMOVE ---------------
    /*
    let JSONdata = data.data;
    let groupType =  jLinq.from(JSONdata).group("mtypeid");
    let types = [];
    //console.log(groupType);
    for(let i in groupType){
        types[i] = groupType[i][0].mtype;
    }
    types.shift(1);
    for(let i = 0; i < types.length; i++){
        let DOMElements = $('.'+types[i]); 
        if(DOMElements.length){
            let DBElements = jLinq.from(JSONdata).equals("mtype",types[i]).select(
                rec => ({
                    name   : rec.name,
                    prefix : rec.prefix,
                    status : rec.status
                })
            );
            for(let j = 0; j < DBElements.length; j++){
                if($('#'+DBElements[j].prefix).length){
                    if(types[i] === "motor")
                        setCustTransportColor(DBElements[j].prefix,DBElements[j].status);
                    else if(types[i] === "valve")
                        setCustValveColor(DBElements[j].prefix,DBElements[j].status);
                }
            }
        }
    }
    */

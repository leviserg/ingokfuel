let updatePeriod = 12; // sec
$(document).ready(function(){
    let dt = setInterval("getCurData()", updatePeriod*1000);
    let dtupdt = setInterval("updTable()", 300*1000);

    getCurData();
    updTable();
    $('#pagetitle').text('ГСМ ЖДЦ');

    $("#addreport").click(function(elem){
        let reportdata = {
            plc_n : [
                {id : 200, value : "Все"},                
                {id : 7, value : "Отвальная (ДТ)"},
                {id : 8, value : "Промышленная (ДТ)"},
            ],
            tank : [
                {id : 0, value : "Все"},                   
                {id : 11, value : "Резервуар РГС-25"}    // 12
                {id : 12, value : "Резервуар РГС-50"}    // 12
            ],
            filename : "report_rlw"
        };
        createReportShowForm(reportdata);
    });

});

function updTable(){
    let names = ['FOtv','FProm'];
    let ExportEnable = false;
    showDataTable('localrlwtablecontent', names, ExportEnable);
}

function getCurData(){
    let prdir = $('#prdir').text();
    $.ajax({
        type:'GET',
        url: '../'+prdir+'app/ajax/ajaxroutes.php/',
        data: { homecurdata : true },
        cache: false,
        crossDomain: true,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data){
            showPageContent(data);
        },
        error: function(err){
            console.log(err);
        }
    });
    //var table = $('#tablelocalrlwtablecontent').DataTable();
    //table.draw();
}
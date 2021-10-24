let updatePeriod = 12; // sec
$(document).ready(function(){
    let dt = setInterval("getCurData()", updatePeriod*1000);
    let dtupdt = setInterval("updTable()", 61*1000);
    getCurData();
    updTable();
    $('#pagetitle').text('АЗС АТЦ');
    $("#addreport").click(function(elem){
        let reportdata = {
            plc_n : [
                {id : 100, value : "Все"},
                {id : 4, value : "АЗК-2 (А-92)"},
                {id : 5, value : "АЗК-4 (ДТ)"},
                {id : 6, value : "АЗК-5 (ДТ)"},
            ],
            tank : [
                {id : 0, value : "Все"},
                {id : 8, value : "Резервуар P2 (А-92)"},
                {id : 9, value : "Резервуар P4 (ДТ)"},
                {id : 10, value : "Резервуар P5 (ДТ)"}               
            ],
            filename : "report_azs"
        };
        createReportShowForm(reportdata);
    });
});

function updTable(){
    let names = ['colR2','colR4','colR5'];
    let ExportEnable = false;
    showDataTable('localazstablecontent', names, ExportEnable);
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
    //var table = $('#tablelocalazstablecontent').DataTable();
    //table.draw();
}
let updatePeriod = 12; // sec
$(document).ready(function(){
    let dt = setInterval("getCurData()", updatePeriod*1000);
    let dtupdt = setInterval("updTable()", 300*1000);
    getCurData();
    updTable();
    $('#pagetitle').text('ГСМ ЖДЦ Отвальная');

    $("#addreport").click(function(elem){
        let reportdata = {
            plc_n : [
                {id : 7, value : "ППВ-100 (ДТ)"},
            ],
            tank : [
                {id : 11, value : "Резервуар РГС-25"}   // 11  
            ],
            filename : "report_otv"
        };
        createReportShowForm(reportdata);
    });
});

function updTable(){
    let names = ['FOtv'];
    let ExportEnable = false;
    showDataTable('localotvtablecontent', names, ExportEnable);
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
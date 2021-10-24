$(document).ready(function(){

    $('#pagetitle').text('Участки');
    let usrDepartment = userDepartment();
    let names = [];
    
    //console.log(usrDepartment);
    
    if(usrDepartment == 1){
        names = ['F1','F2','colNova'];
    }
    else if(usrDepartment == 2){
        names = ['colR2','colR4','colR5'];
    }
    else if(usrDepartment == 3){
        names = ['FOtv','FProm'];
    }
    else if(usrDepartment == 0){
        names = ['F1','F2','colNova','colR2','colR4','colR5','FOtv','FProm'];
    }

    let ExportEnable = true;
    showWideDataTable('eventstablecontent', names, ExportEnable);


    $("#addreport").click(function(elem){
        let reportdata = {
            plc_n : [
                {id : 300, value : "Все"},
                {id : 1, value : "ЦПП Optimass (ДТ)"},
                {id : 2, value : "ЦПП (Керосин)"},
                {id : 3, value : "АЗК ЦПП NOVA 2101 (А-92)"},
                {id : 4, value : "АЗК АБП-2 (А-92)"},  
                {id : 5, value : "АЗК АБП-4 (ДТ)"}, 
                {id : 6, value : "АЗК АБП-5 (ДТ)"},                               
                {id : 7, value : "Отвальн (ДТ)"},
                {id : 8, value : "Промышл (ДТ)"}
            ],
            tank : [
                {id : 0, value : "Все"},
                {id : 1, value : "Резервуар 22 (ДТ)"},
                {id : 2, value : "Резервуар 23 (ДТ)"},
                {id : 3, value : "Резервуар 24 (ДТ)"},
                {id : 4, value : "Резервуар 11 (А-92)"},
                {id : 5, value : "Резервуар 12 (А-92)"},
                {id : 6, value : "Резервуар 92 (Керосин)"},
                {id : 7, value : "Резервуар 16 (Керосин)"}, 
                {id : 8, value : "Рез-р АЗС Р2 (А-92)"},
                {id : 9, value : "Рез-р АЗС Р4 (ДТ)"},
                {id : 10, value : "Рез-р АЗС Р5 (ДТ)"}, 
                {id : 11, value : "Рез-р РГС-25 Отвальн"},
                {id : 12, value : "Рез-р РГС-50 Промышл"}           
            ],
            filename : "report_events_"
        };
        createReportShowForm(reportdata);
    });

});
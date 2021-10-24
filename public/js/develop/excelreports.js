function createReportShowForm(reportdata){
    $('#ctrlwindowcontent').empty();
    $('#ctrlwindowtitle').text("Параметры отчета");
    let content = '';

    let now = new Date();
	var day = ("0" + now.getDate()).slice(-2);
	var pday = ("0" + (now.getDate()-1)).slice(-2);	
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
	var today = now.getFullYear()+"-"+(month)+"-"+(day);
	var yesterday = now.getFullYear()+"-"+(month)+"-"+(pday);

    content += '<div class="form-group row my-2">';
    content += '<div class="col-sm-6">Узел учета</div>';
    content += '<div class="col-sm-6">';
    content += '<select class="form-control text-center" id="plc_n">';
    for(let id in reportdata.plc_n){
        content += '<option value="'+reportdata.plc_n[id].id+'">'+reportdata.plc_n[id].value +'</option>';  
    }
    content += '</select>'; 
    content += '</div></div>';

    content += '<div class="form-group row my-2">';
    content += '<div class="col-sm-6">Резервуар</div>';
    content += '<div class="col-sm-6">';
    content += '<select class="form-control text-center" id="id_rez">';
    for(let id in reportdata.tank){
        content += '<option value="'+reportdata.tank[id].id+'">'+reportdata.tank[id].value +'</option>';
    }
    content += '</select>'; 
    content += '</div></div>';

    content += '<p class="text-info py-0 my-0">Начало (дата) 00:00:00 / Завершено (дата) 23:59:59</p>';
    content += '<div class="form-group row my-2">';
    content += '<div class="col-sm-6"><input type="text" id="startdate" class="form-control text-center" placeholder="гггг-мм-дд" value="'+yesterday+'"/></div>';
    content += '<div class="col-sm-6"><input type="text" id="enddate" class="form-control text-center" placeholder="гггг-мм-дд" value="'+today+'"/></div>';
    content += '</div>';
    content += '<p class="small text-black-50 pt-1 mt-1">* Формат даты ГГГГ-ММ-ДД</p>';

    $('#ctrlwindowcontent').append(content);
    $('.modal-bottom').empty();
    let bottom = '<button class="btn btn-info pt-1 mr-2 pr-2" style="width:47%" id="createreport">Создать</button>';
    bottom += '<button class="btn btn-outline-info pt-1 ml-2 pl-2" style="width:47%" type="button" data-dismiss="modal" id="clmodal" aria-label="Close">Закрыть</button>';
    $('.modal-bottom').append(bottom);
    $("#createreport").bind("click",function(elem){
        let ajaxdata = {
            startdate : $('#startdate').val(),
            enddate : $('#enddate').val(),
            id_rez : $('#id_rez :selected').val(),
            plc_n : $('#plc_n :selected').val(),
            filename : reportdata.filename
        };
        let startdate = moment(ajaxdata.startdate);
        let enddate = moment(ajaxdata.enddate);
        if(!startdate.isValid()) {
            $("#startdate").css('background','yellow');
        }     
        else if(!enddate.isValid()) {
            $("#enddate").css('background','yellow');
        } 
        else{
            createReport(ajaxdata);
        }
    });
    $("#clmodal").bind("click",function(elem){
        window.location.reload();
    });
    $("#clsctrlwind").bind("click",function(elem){
        window.location.reload();
    });
    $('#ctrlwindow').modal("show"); 

}

function createReport(ajaxdata){
    $('#ctrlwindow').modal("hide");
    let prdir = $('#prdir').text();
    $.ajax({
        type:'GET',
        url: '../'+prdir+'app/ajax/ajaxroutes.php/',
        data: { getreportdata : JSON.stringify(ajaxdata) },
        cache: false,
        crossDomain: true,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        beforeSend: function() {
            swal("Отчет", "Подождите.\nФормирую отчет...", "info");
        },        
        success: function(data){
            if(parseInt(data.data) == -1){
                swal("Нет данных", "Извините, не могу найти данных для отчета.\nПопробуйте изменить дату/параметры по отчету...", "warning").
                then(function(res){
                    window.location.reload(); 
                });
            }
            else if(data.data.length > 5){
                swal({
                    title : "Отчет", 
                    text : "Отчет успешно создан.\nНажмите ОК для загрузки\n",
                    icon : "success"
                }).
                then(function(res){
                    window.location = (data.data); 
                });
            }
            else{
                swal("Ошибка", "Не могу построить отчет", "error").then(function(res){
                    window.location.reload();
                });
            }
        },
        error: function(err){
            swal("Error", "Something went wrong\n" + err.responseText, "error");
            console.log(err);
        }
    });
}

function createMonthReportShowForm(elemId){
    $('#ctrlwindowcontent').empty();
    $('#ctrlwindowtitle').text("Параметры суммарного отчета");
    let content = '';
    let bindTo = 0;
    let elemLocName = elemId.slice(1);
    if(elemLocName == 'F1'){
        bindTo = 1;
    }
    else if(elemLocName == 'AZS'){
        bindTo = 2;        
    }
    else if(elemLocName == 'FOtv'){
        bindTo = 3;
    }
    else if(elemLocName == 'FProm'){
        bindTo = 4;
    }
    else if(elemLocName == 'All'){
        bindTo = 5;
    } 
    let now = new Date();
	var day = ("0" + now.getDate()).slice(-2);	
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
	var today = now.getFullYear()+"-"+(month)+"-"+(day);
	var prevday = now.getFullYear()+"-"+(month)+"-01";

    content += '<p class="text-info py-0 my-0">Начало (дата) 00:00:00 / Завершено (дата) 23:59:59</p>';
    content += '<div class="form-group row my-2">';
    content += '<div class="col-sm-6"><input type="text" id="startdate" class="form-control text-center" placeholder="гггг-мм-дд" value="'+prevday+'"/></div>';
    content += '<div class="col-sm-6"><input type="text" id="enddate" class="form-control text-center" placeholder="гггг-мм-дд" value="'+today+'"/></div>';
    content += '</div>';
    content += '<p class="small text-black-50 pt-1 mt-1">* Формат даты ГГГГ-ММ-ДД</p>';

    $('#ctrlwindowcontent').append(content);
    $('.modal-bottom').empty();
    let bottom = '<button class="btn btn-info pt-1 mr-2 pr-2" style="width:47%" id="createreport">Создать</button>';
    bottom += '<button class="btn btn-outline-info pt-1 ml-2 pl-2" style="width:47%" type="button" data-dismiss="modal" id="clmodal" aria-label="Close">Закрыть</button>';
    $('.modal-bottom').append(bottom);
    $("#createreport").bind("click",function(elem){
        let ajaxdata = {
            startdate : $('#startdate').val(),
            enddate : $('#enddate').val(),
            bindto : bindTo,
            filename : 'sum_report_' + elemLocName
        };
        let startdate = moment(ajaxdata.startdate);
        let enddate = moment(ajaxdata.enddate);
        if(!startdate.isValid()) {
            $("#startdate").css('background','yellow');
        }     
        else if(!enddate.isValid()) {
            $("#enddate").css('background','yellow');
        } 
        else{
            createMonthReport(ajaxdata);
        }
    });
    $("#clmodal").bind("click",function(elem){
        window.location.reload();
    });
    $("#clsctrlwind").bind("click",function(elem){
        window.location.reload();
    });
    $('#ctrlwindow').modal("show"); 
}

function createMonthReport(ajaxdata){
    $('#ctrlwindow').modal("hide");
    let prdir = $('#prdir').text();
    $.ajax({
        type:'GET',
        url: '../'+prdir+'app/ajax/ajaxroutes.php/',
        data: { getmonthreport : JSON.stringify(ajaxdata) },
        cache: false,
        crossDomain: true,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        beforeSend: function() {
            swal("Суммарный отчет", "Подождите.\nФормирую суммарный отчет...", "info");
        },        
        success: function(data){
            if(parseInt(data.data) == -1){
                swal("Нет данных", "Извините, не могу найти данных для отчета.\nПопробуйте изменить дату/параметры по отчету...", "warning").
                then(function(res){
                    window.location.reload();  
                });
            }
            else if(data.data.length > 5){
                swal({
                    title : "Суммарный отчет", 
                    text : "Отчет успешно создан.\nНажмите ОК для загрузки\n",
                    icon : "success"
                }).
                then(function(res){
                    window.location = (data.data); 
                });
            }
            else{
                swal("Ошибка", "Не могу построить\nсуммарный отчет", "error").
                then(function(res){
                    window.location.reload(); 
                });
            }
        },
        error: function(err){
            swal("Error", "Something went wrong\n" + err.responseText, "error");
            console.log(err);
        }
    });
}
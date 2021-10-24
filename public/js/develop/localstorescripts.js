let updatePeriod = 4; // sec
let manClsPlcCmd = 7;
let saveClsPlcCmd = 8;
let firstCycle = 0;
$(document).ready(function(){
    let dt = setInterval("getCurData()", updatePeriod*1000);
    let dtupdt = setInterval("updTable()", 300*1000);
    getCurData();
    updTable();
    $('#pagetitle').text('Склад ГСМ');
    if(isEnCtrl() == 0){
        $(".nTask").css('display','none');
        $(".sTask").css('display','none');  
        $(".rTask").css('display','none');  
        $(".tTask").css('display','none'); 
        $(".sett").css('display','none');
    }

    $("#settDZ").click(function (elem){
        showDZWindow();
    });

    $("#addreport").click(function(elem){
        let reportdata = {
            plc_n : [
                {id : 0, value : "Все"},
                {id : 1, value : "Optimass (ДТ)"},
                {id : 2, value : "ППВ-100 (Керосин)"},
                {id : 3, value : "АЗС ЦПП (А-92)"},
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
            ],
            filename : "report_cpp"
        };
        createReportShowForm(reportdata);
    });

    $(".sett").mouseover(function() {
        $( this ).css('cursor', 'pointer');
        let ElemId = $( this ).attr('id');
        $('#' + ElemId).css('fill', 'rgb(0,38,255)');
    });

    $(".sett").mouseout(function() {
        let ElemId = $( this ).attr('id');
        $('#' + ElemId).css('fill', 'rgb(117,117,117)');
    });
});

function updTable(){
    let names = ['F1','F2','colNova'];
    let ExportEnable = false;    
    showDataTable('localstoretablecontent', names, ExportEnable);
}

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
            showPageContent(data);
            if(isEnCtrl() == 1){
                checkLastTaskStatus();
            }
        },
        error: function(err){
            console.log(err);
        }
    });
    //var table = $('#tablelocalstoretablecontent').DataTable();
    //table.draw();
}

function BindBtnFns(){
    let prdir = $('#prdir').text();
    $.ajax({
        type:'GET',
        // url: '../app/core/Routes.php/',
        url: '../'+prdir+'app/ajax/ajaxroutes.php/',
        data: { checklasttaskstatus : true },
        cache: false,
        crossDomain: true,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data){
            setLocalCtrlBtnStyle(data.data);
        },
        error: function(err){
            console.log(err);
        }
    });
}

function checkLastTaskStatus(){
    let prdir = $('#prdir').text();
    $.ajax({
        type:'GET',
        // url: '../app/core/Routes.php/',
        url: '../'+prdir+'app/ajax/ajaxroutes.php/',
        data: { checklasttaskstatus : true },
        cache: false,
        crossDomain: true,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data){
            setLocalCtrlBtnStyle(data.data);
        },
        error: function(err){
            console.log(err);
        }
    });
}

function setLocalCtrlBtnStyle(data){
    $(".nTask").css('display','block');
    $(".sTask").css('display','block'); 
    $(".tTask").css('display','block'); 
    $(".sett").css('display','block');

    for(i in data)  {
        let fillobj = data[i][0];
        if(fillobj.finished && fillobj.closed){
            BtnNewTaskEnabled(fillobj);
        }
        else if(fillobj.started){
            BtnTaskCloseEnabled(fillobj);
        }
        else{
            BtnTaskCloseBusy(fillobj);
        }
        // ------ new ------
        if(firstCycle == 0){
            $("#gn" + fillobj.web_name).bind("click",function(elem){
                let ctrlId = $( this ).attr('id').substr(2);
                createNewTask(ctrlId);
            });
            // ------ close -----
            $("#gs" + fillobj.web_name).bind("click",function(elem){
                let ctrlId = $( this ).attr('id').substr(2);
                closeNewTask(ctrlId);
                //swal("Налив не завершен", "Извините.\nНе могу завершить задачу.\nУстройство id=" + ctrlId + " в процессе налива.", "warning");
            });
            // ------ run -----        
            $("#gt" + fillobj.web_name).bind("click",function(elem){
                let ctrlId = $( this ).attr('id').substr(2);
                runNewTask(ctrlId);
            });
            // ------ pause -----        
            $("#gp" + fillobj.web_name).bind("click",function(elem){
                let ctrlId = $( this ).attr('id').substr(2);
                stopNewTask(ctrlId);
            });
        }
    }
    firstCycle = 1;
}

function createNewTask(point){
    let prdir = $('#prdir').text();
    $.ajax({
        type:'GET',
        // url: '../app/core/Routes.php/',
        url: '../'+prdir+'app/ajax/ajaxroutes.php/',
        data: { checklasttaskstatus : true },
        cache: false,
        crossDomain: true,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data){
            let prdir = $('#prdir').text();
            let curIndex = parseInt(point.substr(1)) - 1;
            let dataobj = data.data[curIndex][0];
            let pointId = point;
            if(dataobj.finished && dataobj.closed && dataobj.started){
                $.ajax({
                    type:'GET',
                    // url: '../app/core/Routes.php/',
                    url: '../'+prdir+'app/ajax/ajaxroutes.php/',
                    data: { point : pointId, newtask : true },
                    cache: false,
                    crossDomain: true,
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    beforeSend: function() {
                        swal("Загрузка", "Подождите.\nЗагружаю данные формы...", "success");
                    },
                    success: function(data){
                        swal.close();
                        let indata = data.data;
                        createNewTaskShowContent(indata, pointId);  
                    },
                    error: function(err){
                        swal.close();
                        console.log(err);
                    }
                });
            }
            else{
                swal("Предупреждение", "Нельзя начинать новую задачу\nдо завершения предыдущей. ", "warning");
            }
        },
        error: function(err){
            console.log(err);
        }
    });
}

function createNewTaskShowContent(data, point){
    $('#ctrlwindowcontent').empty();
    $('#ctrlwindowtitle').text("Новая задача по " + point);
    let content = '';
        content += '<div class="form-group row mb-0 pb-0"><label for="itemnum" class="col-sm-5 col-form-label text-info">Гос.номер*</label>';
        content += '<div class="col-sm-7"><input type="text" class="form-control text-center" id="itemnum" value="" maxlength="12" placeholder="XX1234YY" /></div></div>'; 
        content += '<small class="text-black-50"><i>Введите номер и нажмите Enter для поиска</i></small>';         
        content += '<div class="form-group row mt-2"><label for="itemnum" class="col-sm-5 col-form-label text-info">Найдено</label><div class="col-sm-7"></div></div>';
            
        content += '<div class="form-group row mt-2"><div class="col-sm-12"></div><select class="custom-select custom-select-sm" id="itemtrans" size="4"></select></div>';

        content += '<div class="form-group row mt-2"><label for="itemvol" class="col-sm-5 col-form-label text-info">Объем топлива, л*</label>';
        content += '<div class="col-sm-7"><input type="number" class="form-control text-center" id="itemvol" min="1" max="99999" value="1"/></div></div>';
        content += '<div class="form-group row my-2"><label for="itemdest" class="col-sm-5 col-form-label text-info">Назначение</label>';
        content += '<div class="col-sm-7">' + getDestSelector(data, 0) + '</div></div>';

        let TankListF1 = [
            {id : 1, fulltitle : 'Резервуар №22'},
            {id : 2, fulltitle : 'Резервуар №23'},
            {id : 3, fulltitle : 'Резервуар №24'}
        ];

        let TankListF2 = [
            {id : 6, fulltitle : 'Резервуар №92'},
            {id : 7, fulltitle : 'Резервуар №16'}
        ];

        if(point === "F1"){
            content += '<div class="form-group row my-2"><label for="itemtank" class="col-sm-5 col-form-label text-info">Резервуар</label>';
            content += '<div class="col-sm-7">' + getTankSelector(TankListF1, 0) + '</div></div>';

            content += "<div class='form-check form-check-inline my-2 ml-3 pl-2'>";
            content += "<input class='form-check-input' type='radio' name='rdpump' id='rdH9' value='0' checked>";
            content += "<label class='form-check-label text-info' for='rdH9'>Включать насос(ы) Н9/10</label>";
            content += "</div>";
            content += "<div class='form-check form-check-inline my-2 ml-3 pl-2'>";
            content += "<input class='form-check-input' type='radio' name='rdpump' id='rdH10' value='1'>";
            content += "<label class='form-check-label text-info' for='rdH10'>Включать насос(ы) Н4/5</label>";
            content += "</div><br/>";
        }

        if(point === "F2"){
            content += '<div class="form-group row my-2"><label for="itemtank" class="col-sm-5 col-form-label text-info">Резервуар</label>';
            content += '<div class="col-sm-7">' + getTankSelector(TankListF2, 0) + '</div></div>';
        }

    content += '<small class="text-black-50"><i>* - Заполнить обязательно</i></small>'; 
    $('#ctrlwindowcontent').append(content);
    $('.modal-bottom').empty();
    let bottom = '<button class="btn btn-info pt-1 mr-2 pr-2" style="width:47%" id="savenewtask">Задать</button>';
    bottom += '<button class="btn btn-outline-info pt-1 ml-2 pl-2" style="width:47%" type="button" data-dismiss="modal" aria-label="Close">Отмена</button>';
    $('.modal-bottom').append(bottom);

    $('input[type=radio][name=rdpump]').click(function (elem){
        let val = $('input[type=radio][name=rdpump]:checked').val();
        console.log(val);
    });


    $("#itemnum").keyup(function(){
        let num = this.value;
        let prdir = $('#prdir').text();
        if(num.length >= 3){
            $.ajax({
                type:'GET',
                // url: '../app/core/Routes.php/',
                url: '../'+prdir+'app/ajax/ajaxroutes.php/',
                data: { drive : num, newtask : true },
                cache: false,
                crossDomain: true,
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function(data){
                    let indata = data.data;
                    if(indata.length != 0){
                        $('#itemtrans').empty();
                        let incontent = '';
                        for(let i = 0; i < indata.length; i++){
                            if(i == 0){
                                incontent += '<option value="'+indata[i].id+'" selected="selected" data-id="'+indata[i].lim+'"><small>'+indata[i].num+'; '+ indata[i].mark + '; '+ indata[i].org + '; '+ indata[i].driv +'; Лимит : '+ indata[i].lim +' л</small></option>';
                            }
                            else{
                                incontent += '<option value="'+indata[i].id+'" data-id="'+indata[i].lim+'"><small>'+indata[i].num+'; '+ indata[i].mark + '; '+ indata[i].org + '; '+ indata[i].driv +'; Лимит : '+ indata[i].lim +' л</small></option>';
                            }
                        }
                        $('#itemtrans').append(incontent);
                    }
                    else{
                        $('#itemtrans').empty();
                        $("#itemnum").on('keyup', function (e) {
                            if (e.key === 'Enter' || e.keyCode === 13) {
                                confirmNewTransportOnSearchNull(num);
                            }
                        });
                    }
                },
                error: function(err){
                    console.log(err);
                }
            });
        }
    });

    $("#savenewtask").bind("click",function(elem){
        if($('#itemtrans').val() == 0 || $('#itemtrans').val() == null){
            $('#itemnum').addClass('bg-warning');
        }
        else{
            let lim = parseInt($('#itemtrans :selected').attr('data-id'));
            let selPump = 0;
            if(point === "F1"){
                selPump = $('input[type=radio][name=rdpump]:checked').val(); 
            }
            let setpoint = parseInt($('#itemvol').val());
            if(setpoint > lim){
                swal("Превышение", "Превышен установленный лимит топлива", "warning").then(function(e){
                    $('#itemvol').addClass('bg-warning');
                });
            }
            else{
                let savedata = {
                    point : point,
                    pump : selPump,
                    trans : $('#itemtrans').val(),
                    vol : $('#itemvol').val(),
                    dest : $('#itemdest').val(),
                    tank : $('#itemtank').val()
                };
                saveNewTask(savedata);
            }
        }
    });    
    $('#ctrlwindow').modal("show"); 
}

function confirmNewTransportOnSearchNull(num){
    swal({
        title: "Нет данных",
        text: "Отсутсвуют данные по указанному поиску " + num + ".\nДобавить новый транспорт?",
        icon: "warning",
        buttons:["Отмена", "Добавить"]
    })
      .then(function(willCreate){
        if (willCreate) {
            //$('#ctrlwindow').modal("hide", newTransportShowForm());
            newTransportShowForm();
        } else {
            $('#ctrlwindow').modal("hide");
        }
    });
}

function saveNewTask(savedata){
    $('#ctrlwindow').modal("hide");
    let prdir = $('#prdir').text();
    $.ajax({
        type:'GET',
        url: '../'+prdir+'app/ajax/ajaxroutes.php/',
        data: { newtaskdata: JSON.stringify(savedata), newtask : true },
        cache: false,
        crossDomain: true,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data){
            $('#ctrlwindow').modal("hide"); 
            swal("Сохранено", "Данные доставлены для выполнения", "success").
            then(function(res){
                window.location.reload();
            });
        },
        error: function(err){
            console.log(err);
        }
    });
}

function closeNewTask(meterid){
    let prdir = $('#prdir').text();
    swal({
        title: "Остановить запущенную задачу?",
        text: "Внимание.\nОстановка текущей задачи до завершения\nможет привести к отклонениям измерений!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
    .then((selConfirm) => {
        if (selConfirm) {
            $.ajax({
                type:'GET',
                url: '../'+prdir+'app/ajax/ajaxroutes.php/',
                data: { meterid: meterid, manstop : 1 },
                cache: false,
                crossDomain: true,
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function(data){
                    swal("Сохранено", "Ваша задача остановлена до завершения.\nДля продолжения создайте новую задачу.", "warning").
                    then(function(res){
                        SetPumpCommand("gr" + meterid, meterid, manClsPlcCmd);
                    });
                },
                error: function(err){
                    console.log(err);
                }
            });
        }
    });
    /*
    $.ajax({
        type:'GET',
        // url: '../app/core/Routes.php/',
        url: '../'+prdir+'app/ajax/ajaxroutes.php/',
        data: { checklasttaskstatus : true },
        cache: false,
        crossDomain: true,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data){
            let prdir = $('#prdir').text();
            let curIndex = parseInt(meterid.substr(1)) - 1;
            let dataobj = data.data[curIndex][0];
            if(dataobj.finished && !dataobj.closed){
                $.ajax({
                    type:'GET',
                    url: '../'+prdir+'app/ajax/ajaxroutes.php/',
                    data: { meterid: meterid, manstop : 0 },
                    cache: false,
                    crossDomain: true,
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    success: function(data){
                        swal("Сохранено", "Вы можете создать новую задачу", "success").
                        then(function(res){
                            window.location.reload();
                        });
                    },
                    error: function(err){
                        console.log(err);
                    }
                });
                //SetPumpCommand("gr" + meterid, meterid, saveClsPlcCmd);
                SetPumpCommand("gr" + meterid, meterid, manClsPlcCmd);
            }
            else if(dataobj.started && !dataobj.finished){
                swal({
                    title: "Остановить запущенную задачу?",
                    text: "Остановка текущей задачи до завершения\nможет привести к отклонениям измерений!",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                })
                .then((selConfirm) => {
                    if (selConfirm) {
                        $.ajax({
                            type:'GET',
                            url: '../'+prdir+'app/ajax/ajaxroutes.php/',
                            data: { meterid: meterid, manstop : 1 },
                            cache: false,
                            crossDomain: true,
                            contentType: 'application/json; charset=utf-8',
                            dataType: 'json',
                            success: function(data){
                                swal("Сохранено", "Ваша задача остановлена до завершения.\nДля продолжения создайте новую задачу.", "warning").
                                then(function(res){
                                    SetPumpCommand("gr" + meterid, meterid, manClsPlcCmd);
                                });
                            },
                            error: function(err){
                                console.log(err);
                            }
                        });
                    }
                });
            }
            else{
                swal("Предупреждение", "Для завершения задачи создайте сначала новую.", "warning");
            }
        },
        error: function(err){
            console.log(err);
        }
    });
    */
}

function runNewTask(meterid){
    let prdir = $('#prdir').text();
    $.ajax({
        type:'GET',
        // url: '../app/core/Routes.php/',
        url: '../'+prdir+'app/ajax/ajaxroutes.php/',
        data: { checklasttaskstatus : true },
        cache: false,
        crossDomain: true,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data){
            let prdir = $('#prdir').text();
            let curIndex = parseInt(meterid.substr(1)) - 1;
            let dataobj = data.data[curIndex][0];
            if(dataobj.started && !dataobj.finished){
                SetPumpCommand("gr" + meterid, meterid, 2);
            }          
            else{
                swal("Предупреждение", "Для пуска задачи дождитесь завершения запущенной\n и потом создайте новую\n", "warning");
            }
        },
        error: function(err){
            console.log(err);
        }
    });
}

function stopNewTask(meterid){
    let prdir = $('#prdir').text();
    $.ajax({
        type:'GET',
        // url: '../app/core/Routes.php/',
        url: '../'+prdir+'app/ajax/ajaxroutes.php/',
        data: { checklasttaskstatus : true },
        cache: false,
        crossDomain: true,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data){
            let prdir = $('#prdir').text();
            let curIndex = parseInt(meterid.substr(1)) - 1;
            let dataobj = data.data[curIndex][0];
            if(dataobj.started && !dataobj.finished){
                SetPumpCommand("gr" + meterid, meterid, 3);
            }          
            else{
                swal("Предупреждение", "Для останова задачи сначала создайте новую\nи запустите", "warning");
            }
        },
        error: function(err){
            console.log(err);
        }
    });
}

function setNull(id){
    return null;
}

function BtnNewTaskEnabled(obj){
    $("#gn" + obj.web_name).mouseover(function() {
        $( this ).css('cursor', 'pointer');
        let ElemId = $( this ).attr('id');
        $('#' + ElemId + ' .svgbtn').css('fill', 'rgb(45,150,66)');
    });
    $("#gn" + obj.web_name + ' .svgbtn').css('fill', 'rgb(58,195,87)');
    $("#gn" + obj.web_name).mouseout(function() {
        let ElemId = $( this ).attr('id');
        $('#' + ElemId + ' .svgbtn').css('fill', 'rgb(58,195,87)');
    });
    // ------ finish -----
    $("#gs" + obj.web_name + ' .svgbtn').css('fill', 'rgb(150,150,150)');
    $("#gs" + obj.web_name).mouseover(function() {
        $( this ).css('cursor', 'pointer');
    });
    // ------- start btn -----
    $(".tTask").mouseover(function() {
        $( this ).css('cursor', 'pointer');
        let ElemId = $( this ).attr('id');
        $('#' + ElemId + ' .svgbtn').css('fill', 'rgb(128,128,128)');
    }); 

    $(".tTask").mouseout(function() {
        let ElemId = $( this ).attr('id');
        $('#' + ElemId + ' .svgbtn').css('fill', 'rgb(150,150,150)');       
    }); 
}

function BtnTaskCloseEnabled(obj){
    // ------ new -----
    $("#gn" + obj.web_name + ' .svgbtn').css('fill', 'rgb(150,150,150)');
    $("#gn" + obj.web_name).mouseover(function() {
        $( this ).css('cursor', 'pointer');
    });
    // ------ finish -----
    $("#gs" + obj.web_name).mouseover(function() {
        $( this ).css('cursor', 'pointer');
        let ElemId = $( this ).attr('id');
        $('#' + ElemId + ' .svgbtn').css('fill', 'rgb(160,83,35)');
    });
    $("#gs" + obj.web_name).mouseout(function() {
        let ElemId = $( this ).attr('id');
        $('#' + ElemId + ' .svgbtn').css('fill', 'rgb(255,132,56)');
    });    
    $('#gs' + obj.web_name + ' .svgbtn').css('fill', 'rgb(255,132,56)');
    // ------- start btn -----
    $(".tTask").mouseover(function() {
        $( this ).css('cursor', 'pointer');
        let ElemId = $( this ).attr('id');
        $('#' + ElemId + ' .svgbtn').css('fill', 'rgb(64,70,140)');
    }); 
    $(".tTask").mouseout(function() {
        let ElemId = $( this ).attr('id');
        $('#' + ElemId + ' .svgbtn').css('fill', 'rgb(128,132,175)');       
    }); 

}

function BtnTaskCloseBusy(obj){
    // ------ new ------
    $("#gn" + obj.web_name + ' .svgbtn').css('fill', 'rgb(150,150,150)');
    $("#gn" + obj.web_name).mouseover(function() {
        $( this ).css('cursor', 'pointer');
    });
    // ------ finish ------
    $("#gs" + obj.web_name).mouseover(function() {
        $( this ).css('cursor', 'pointer');
        let ElemId = $( this ).attr('id');
        $('#' + ElemId + ' .svgbtn').css('fill', 'rgb(119,13,13)');
    });
    $("#gs" + obj.web_name).mouseout(function() {
        let ElemId = $( this ).attr('id');
        $('#' + ElemId + ' .svgbtn').css('fill', 'rgb(181,68,68)');
    });    
    $('#gs' + obj.web_name + ' .svgbtn').css('fill', 'rgb(181,68,68)');
    // ------- start btn -----
    $(".tTask").mouseover(function() {
        $( this ).css('cursor', 'pointer');
        let ElemId = $( this ).attr('id');
        $('#' + ElemId + ' .svgbtn').css('fill', 'rgb(64,70,140)');
    }); 
    $(".tTask").mouseout(function() {
        let ElemId = $( this ).attr('id');
        $('#' + ElemId + ' .svgbtn').css('fill', 'rgb(128,132,175)');       
    });  
}

function newTransportShowForm(){
    let prdir = $('#prdir').text();
    $.ajax({
        type:'GET',
        url: '../'+prdir+'app/ajax/ajaxroutes.php/',
        data: { getorgs: true },
        cache: false,
        crossDomain: true,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        beforeSend: function() {
            swal("Загрузка", "Подождите.\nЗагружаю данные формы...", "success");
        },
        success: function(data){
            swal.close();
            newTransportFillForm(data.data);
        },
        error: function(err){
            swal.close();
            console.log(err);
        }
    });
}

function newTransportFillForm(data){
    $('#ctrlwindowcontent').empty();
    $('#ctrlwindowtitle').text("Справочник транспорта");
    let content = '';

    let orgs = data[0].orgs;
    let mvz = data[1].mvz;
    let spp = data[2].spp;

    content += '<h5 class="text-center mb-3">Новый транспорт</h5>';
        content += '<div class="form-group row mb-2"><label for="itemorg" class="col-sm-5 col-form-label text-info">Организация*</label>';
        //content += '<div class="col-sm-7"><input type="text" class="form-control text-center" id="itemorg" value=""  maxlength="50" placeholder="Укажите организацию..."/></div></div>';
        content += '<div class="col-sm-7">' + getOrgSelector(orgs, 2) + '</div></div>';
        content += '<div class="form-group row mb-2"><label for="itemmark" class="col-sm-5 col-form-label text-info">Марка транспорта*</label>';
        content += '<div class="col-sm-7"><input type="text" class="form-control text-center" id="itemmark" value="" maxlength="30" placeholder="МАЗ, Мерседес, РЕНО..."/></div></div>'; 
        content += '<div class="form-group row mb-2"><label for="itemnum" class="col-sm-5 col-form-label text-info">Гос.номер* <small>(англ.!!!)</small></label>';
        content += '<div class="col-sm-7"><input type="text" class="form-control text-center" id="itemnum" value="" maxlength="12" placeholder="XX1234YY" /></div></div>';     
        content += '<div class="form-group row mb-2"><label for="itemrfid" class="col-sm-5 col-form-label text-info">RFID-метка</label>';
        content += '<div class="col-sm-7"><input type="text" class="form-control text-center" id="itemrfid" value="" maxlength="36"/></div></div>';
        content += '<div class="form-group row mb-2"><label for="itemdriv" class="col-sm-5 col-form-label text-info">Ответств.лицо</label>';
        content += '<div class="col-sm-7"><input type="text" class="form-control text-center" id="itemdriv" value="" maxlength="100" placeholder="Ф.И.О. (Иванов И. И.)"/></div></div>';        
        content += '<div class="form-group row mb-2"><label for="itemlim" class="col-sm-5 col-form-label text-info">Лимит топлива, л*</label>';
        content += '<div class="col-sm-7"><input type="number" class="form-control text-center" id="itemlim" min="-1" max="99999" value="-1"/></div></div>';
        content += '<div class="form-group row mb-2"><label for="itemnotes" class="col-sm-5 col-form-label text-info">Примечания</label>';
        content += '<div class="col-sm-7"><input type="text" class="form-control text-center" id="itemnotes" value="" maxlength="200"/></div></div>'; 
        content += '<div class="form-group row mb-2"><label for="itembind" class="col-sm-5 col-form-label text-info">Привязать к пункту налива*</label>';
        content += '<div class="col-sm-7">';
        content += getBindSelector(bindArray, 1, false);
        content += '</div></div>';
        content += '<div class="form-group row mb-2"><label for="itemmvz" class="col-sm-5 col-form-label text-info">МВЗ</label>';
        content += '<div class="col-sm-7">';
        content += getMvzSelector(mvz, 0);
        content += '</div></div>';
        content += '<div class="form-group row mb-2"><label for="itemspp" class="col-sm-5 col-form-label text-info">СПП</label>';
        content += '<div class="col-sm-7">';
        content += getSppSelector(spp, 0);
        content += '</div></div>';
    content += '<small class="text-black-50"><i>* - Заполнить обязательно</i></small>'; 
    $('#ctrlwindowcontent').append(content);
    $('.modal-bottom').empty();
    let bottom = '<button class="btn btn-info pt-1 mr-2 pr-2" style="width:47%" id="savenewitem">Сохранить</button>';
    bottom += '<button class="btn btn-outline-info pt-1 ml-2 pl-2" style="width:47%" type="button" data-dismiss="modal" id="clmodal" aria-label="Close">Закрыть</button>';
    $('.modal-bottom').append(bottom);
    $("#savenewitem").bind("click",function(elem){
        let savedata = {
            org : $('#itemorg').val(),
            mark : $('#itemmark').val(),
            num : $('#itemnum').val(),
            rfid : $('#itemrfid').val(),
            driv : $('#itemdriv').val(),
            lim : $('#itemlim').val(),            
            notes : $('#itemnotes').val(),
            bindto : $('#itembind').val(),
            mvz : $('#itemmvz').val(),
            spp : $('#itemspp').val()
        };
        if(validateNewTransport(savedata)){
            saveNewTransport(savedata);
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

function saveNewTransport(savedata){
    let prdir = $('#prdir').text();
    $.ajax({
        type:'GET',
        // url: '../app/core/Routes.php/',
        url: '../'+prdir+'app/ajax/ajaxroutes.php/',
        data: { newtranspdata: JSON.stringify(savedata) },
        cache: false,
        crossDomain: true,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data){
            if(data.data == true){
                $('#ctrlwindow').modal("hide"); 
                swal("Сохранено", "Данные успешно внесены.\nДля продолжения создайте задачу снова.", "success").
                then(function(res){
                    window.location.reload(); 
                });
            }
            else{
                swal("Ошибка", "Запись с госномером\n" + savedata.num + "\nуже существует.", "error")
                .then(function(res){
                    $('#itemnum').css('background','yellow');
                });
            }
        },
        error: function(err){
            console.log(err);
        }
    });
}

function validateNewTransport(savedata){
    if(parseInt(savedata.lim) == -1){
        $('#itemlim').css('background','yellow');
        return false;
    }
    else if(savedata.org.length == 0){
        $('#itemlim').css('background','white');
        $('#itemorg').css('background','yellow');
        return false;        
    }
    else if(savedata.mark.length == 0){
        $('#itemorg').css('background','white');
        $('#itemmark').css('background','yellow');
        return false;        
    }    
    else if(savedata.num.length == 0){
        $('#itemmark').css('background','white');
        $('#itemnum').css('background','yellow');
        return false;        
    }
    else{
        $('#itemorg').css('background','white');
        $('#itemlim').css('background','white');
        $('#itemmark').css('background','white');        
        $('#itemnum').css('background','white');   
        return true;     
    }
}

function showDZWindow(){
    let prdir = $('#prdir').text();
    $.ajax({
        type:'GET',
        // url: '../app/core/Routes.php/',
        url: '../'+prdir+'app/ajax/ajaxroutes.php/',
        data: { getdeadzones : true },
        cache: false,
        crossDomain: true,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        beforeSend: function() {
            swal("Загрузка", "Подождите.\nЗагружаю данные формы...", "success");
        },
        success: function(data){
            swal.close();
            let indata = data.data;
            fillDZWindow(indata);
        },
        error: function(err){
            swal.close();
            console.log(err);
        }
    });
}

function fillDZWindow(data){
    $('#ctrlwindowcontent').empty();
    $('#ctrlwindowtitle').text("Зоны нечувствительности наливов");
    let content = '';
    for(let i = 0; i < data.length; i++){
        content += '<div class="form-group row mb-2"><label for="itemdz_'+i+'" class="col-sm-5 col-form-label text-info">'+data[i].title+', л</label>';
        content += '<div class="col-sm-7"><input type="number" class="form-control text-center" id="itemdz_'+i+'" min="0" max="999" step=".01" value="'+parseFloat(data[i].dead_zone)+'"/></div></div>';
    }
    $('#ctrlwindowcontent').append(content);
    $('.modal-bottom').empty();
    let bottom = '<button class="btn btn-info pt-1 mr-2 pr-2" style="width:47%" id="savedeadzones">Сохранить</button>';
    bottom += '<button class="btn btn-outline-info pt-1 ml-2 pl-2" style="width:47%" type="button" data-dismiss="modal" id="clmodal" aria-label="Close">Закрыть</button>';
    $('.modal-bottom').append(bottom);
    $("#savedeadzones").bind("click",function(elem){
        let savedata = {
            F1 : $('#itemdz_0').val(),
            F2 : $('#itemdz_1').val(),
            FOtv : $('#itemdz_2').val(),
            FProm : $('#itemdz_3').val()
        };
        saveNewDeadZones(savedata);
    });
    $("#clmodal").bind("click",function(elem){
        window.location.reload();
    });
    $("#clsctrlwind").bind("click",function(elem){
        window.location.reload();
    });
    $('#ctrlwindow').modal("show"); 
}

function saveNewDeadZones(data){
    let prdir = $('#prdir').text();
    $.ajax({
        type:'GET',
        // url: '../app/core/Routes.php/',
        url: '../'+prdir+'app/ajax/ajaxroutes.php/',
        data: { setzonesdata: JSON.stringify(data) },
        cache: false,
        crossDomain: true,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data){
            if(data.data == true){
                $('#ctrlwindow').modal("hide"); 
                swal("Сохранено", "Данные успешно сохранены", "success").
                then(function(res){
                    window.location.reload(); 
                });
            }
            else{
                swal("Ошибка", "Не могу сохранить данные.", "error");
            }
        },
        error: function(err){
            console.log(err);
        }
    });
}
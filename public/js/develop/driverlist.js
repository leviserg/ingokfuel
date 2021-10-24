$(document).ready(function(){

    $('#pagetitle').text('Участки');

    $("#destlist").bind("click",function(elem){
        showDestinationsList();
    });

    $("#newitem").bind("click",function(elem){
        newItemShowForm();
    });

    let usrDepartment = userDepartment();
    let bindsTo = usrDepartment;

    listTableShow(bindsTo);

});

function showDestinationsList(){
    let prdir = $('#prdir').text();
    $.ajax({
        type:'GET',
        // url: '../app/core/Routes.php/',
        url: '../'+prdir+'app/ajax/ajaxroutes.php/',
        data: { destinations: true },
        cache: false,
        crossDomain: true,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data){
            (data.data != null) ? showDestinationsAll(data) : swal("Нет данных", "Извините.\nНе могу получить данные\nсправочника участков.", "warning");
        },
        error: function(err){
            console.log(err);
        }
    });
}

function showDestinationsAll(data){
    //$('#destwindow').modal("hide");
    let indata = data.data;
    $('#destwindowcontent').empty();
    $('#destwindowtitle').text("Справочник участков");
    let content = '';
    content += '<table class="table table-sm table-responsive px-0 mx-0" style="width:100%; max-height:410px;">';
        content += '<tr class="px-0 mx-0"><td class="text-center">ID</td><td class="text-center">Название</td><td class="text-center">Описание</td><td>Изм.</td></tr>';
        for(let i = 0; i < indata.length; i++){
            let descr = (indata[i].description != null) ? indata[i].description : '';
            content += '<tr class="px-0 mx-0"><td class="text-center">'+indata[i].id+'</td>';
            content += '<td class="text-center">'+indata[i].name+'</td>';
            content += '<td class="text-left small text-black-50"><i>'+ descr +'</i></td>';
            content += '<td><button class="btn btn-sm btn-info mx-0 my-0 px-0 py-0 editdestination" id="edbtn'+indata[i].id+'"><i class="fa fa-wrench mx-2"></i></button></td></tr>'; 
        }
        content += '<tr><td></td><td></td><td></td><td></td></tr>';
    content += '</table>';
    $('#destwindowcontent').append(content);

    $(".editdestination").bind("click",function(elem){
        let dataid = this.id.substring(5);
        getDestination(dataid);
    });
    $("#newdest").bind("click",function(elem){
        newDestinationShowForm();
    });
    $('#destwindow').modal("show");
}

function getDestination(dataid){
    let prdir = $('#prdir').text();
    $.ajax({
        type:'GET',
        // url: '../app/core/Routes.php/',
        url: '../'+prdir+'app/ajax/ajaxroutes.php/',
        data: { destination: dataid },
        cache: false,
        crossDomain: true,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data){
            let indata = data.data[0];
            showDestination(indata);  
        },
        error: function(err){
            console.log(err);
        }
    });
}

function showDestination(dataid){
    $('#ctrlwindowcontent').empty();
    $('#ctrlwindowtitle').text("Справочник участков");
    let content = '';
    content += '<h4 class="text-center">'+dataid.name+'</h4>';
    content += '<div class="form-group">';
    content += '<label for="destname" class="control-label text-info">Название участка</label>';
    content += '<input type="text" class="form-control mb-2" name="destname" id="destname" value="'+dataid.name+'"/>';
    content += '<label for="destdesc" class="control-label text-info">Описание участка</label>';
    content += '<input type="text" class="form-control mb-2 small text-black-50 text-left" name="destdesc" id="destdesc" value="'+dataid.description+'"/>';        
    content += '</div>';
    $('#ctrlwindowcontent').append(content);
    $('.modal-bottom').empty();
    let bottom = '<button class="btn btn-info pt-1 mr-2 pr-2" style="width:47%" id="savedest">Сохранить</button>';
    bottom += '<button class="btn btn-outline-info pt-1 ml-2 pl-2" style="width:47%" type="button" data-dismiss="modal" aria-label="Close">Закрыть</button>';
    $('.modal-bottom').append(bottom);
    $("#savedest").bind("click",function(elem){
        let savedata = {
            id : dataid.id,
            name : $('#destname').val(),
            description : $('#destdesc').val()
        };
        saveDestination(savedata);
    });    
    $('#ctrlwindow').modal("show"); 
}

function saveDestination(savedata){
    let prdir = $('#prdir').text();
    $.ajax({
        type:'GET',
        // url: '../app/core/Routes.php/',
        url: '../'+prdir+'app/ajax/ajaxroutes.php/',
        data: { destdata: JSON.stringify(savedata) },
        cache: false,
        crossDomain: true,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        beforeSend: function() {
            swal("Сохранение", "Подождите.\nСохраняю данные формы...", "success");
        },
        success: function(data){
            swal.close();
            $('#ctrlwindow').modal("hide"); 
            swal("Сохранено", "Данные успешно сохранены", "success").
            then(function(res){
                $('#destwindow').modal("hide"); 
            });
        },
        error: function(err){
            console.log(err);
        }
    });
}

function saveNewDestination(savedata){
    let prdir = $('#prdir').text();
    $.ajax({
        type:'GET',
        // url: '../app/core/Routes.php/',
        url: '../'+prdir+'app/ajax/ajaxroutes.php/',
        data: { newdestdata: JSON.stringify(savedata) },
        cache: false,
        crossDomain: true,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        beforeSend: function() {
            swal("Сохранение", "Подождите.\nСохраняю данные формы...", "success");
        },
        success: function(data){
            swal.close();
            $('#ctrlwindow').modal("hide"); 
            swal("Сохранено", "Данные успешно сохранены", "success").
            then(function(res){
                $('#destwindow').modal("hide"); 
            });
        },
        error: function(err){
            console.log(err);
        }
    });
}

function newDestinationShowForm(){
    $('#ctrlwindowcontent').empty();
    $('#ctrlwindowtitle').text("Справочник участков");
    let content = '';
    content += '<h4 class="text-center">Новый участок</h4>';
    content += '<div class="form-group">';
    content += '<label for="destname" class="control-label text-info">Название участка</label>';
    content += '<input type="text" class="form-control mb-2" name="destname" id="destname" value=""/>';
    content += '<label for="destdesc" class="control-label text-info">Описание участка</label>';
    content += '<input type="text" class="form-control mb-2 small text-black-50 text-left" name="destdesc" id="destdesc" value=""/>';        
    content += '</div>';
    $('#ctrlwindowcontent').append(content);
    $('.modal-bottom').empty();
    let bottom = '<button class="btn btn-info pt-1 mr-2 pr-2" style="width:47%" id="newdest">Сохранить</button>';
    bottom += '<button class="btn btn-outline-info pt-1 ml-2 pl-2" style="width:47%" type="button" data-dismiss="modal" aria-label="Close">Закрыть</button>';
    $('.modal-bottom').append(bottom);
    $("#newdest").bind("click",function(elem){
        let savedata = {
            name : $('#destname').val(),
            description : $('#destdesc').val()
        };
        saveNewDestination(savedata);
    });    
    $('#ctrlwindow').modal("show"); 
}

function newItemShowForm(){
    let prdir = $('#prdir').text();
    $.ajax({
        type:'GET',
        url: '../'+prdir+'app/ajax/ajaxroutes.php/',
        data: { getorgs: true },
        cache: false,
        crossDomain: true,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data){
            newItemFillForm(data.data);
        },
        error: function(err){
            console.log(err);
        }
    });
}

function newItemFillForm(data){
    $('#ctrlwindowcontent').empty();
    $('#ctrlwindowtitle').text("Справочник транспорта");
    let content = '';
    let orgs = data[0].orgs;
    let mvz = data[1].mvz;
    let spp = data[2].spp;

    content += '<h5 class="text-center mb-3">Новый транспорт</h5>';
        content += '<div class="form-group row mb-2"><label for="itemorg" class="col-sm-5 col-form-label text-info">Организация*</label>';
        //content += '<div class="col-sm-7"><input type="text" class="form-control text-center" id="itemorg" value=""  maxlength="50" placeholder="Укажите организацию..."/></div></div>';
        content += '<div class="col-sm-7">' + getOrgSelector(orgs, 0) + '</div></div>';

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
        content += getBindSelector(bindArray, 0, true);
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
    bottom += '<button class="btn btn-outline-info pt-1 ml-2 pl-2" style="width:47%" type="button" data-dismiss="modal" aria-label="Close">Закрыть</button>';
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
        if(validateNewItem(savedata)){
            saveNewItem(savedata);
        }
    });
    $('#ctrlwindow').modal("show"); 
}

function saveNewItem(savedata){
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
        beforeSend: function() {
            swal("Сохранение", "Подождите.\nСохраняю данные формы...", "success");
        },
        success: function(data){
            swal.close();
            if(data.data == true){
                $('#ctrlwindow').modal("hide"); 
                swal("Сохранено", "Данные успешно сохранены", "success").
                then(function(res){
                    window.location.reload(); 
                    /*
                    if ( $.fn.dataTable.isDataTable( '#transportlist' ) ) {
                        table = $('#transportlist').DataTable();
                        table.destroy();
                        listTableShow();
                    }
                    */
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

function validateNewItem(savedata){
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

function listTableShow(bindsTo) {
    let prdir = $('#prdir').text();

    let oTable = $('#transportlist').DataTable({
        processing: false, // true for on-line
        serverSide: false, // true for on-line
        ajax: '../'+prdir+'app/ajax/ajaxroutes.php/?transports='+bindsTo,
        columns: [
            { data: 'id', name: 'id' },      // - 0
            { data: 'mark', name: 'mark' },  // - 1,
            { data: 'num', name: 'num' },    // - 2,
            { data: 'org',  name: 'org'},    // - 3,
            { data: 'driv',  name: 'driv'},  // - 4,
            { data: 'bindto',                // - 5,
                name: 'bindto',
                "render": function ( data, type, full, meta ) {
                    return (data == 0) ? '---' : bindArray[data];
                }
            },    
            { data: 'lim',  name: 'lim'},    // - 6,                                
            { data: 'updtime',               // - 7,
                name: 'updtime',
                "render": function ( data, type, full, meta ) {
                    return moment(data).format('DD.MM.YYYY HH:mm:ss');
                }
            },
            { data: 'notes',  name: 'notes'},// - 8, 
            { data: 'mvz_desc', name: 'mvz_desc' },// - 9,            
            { 
                data : {
                    'id':'id',                // - 10,
                },
                name : 'id',
                'render': function(data, type, row, meta){
                    if(type === 'display'){
                        data = '<button class="btn btn-xs btn-info edit my-0 px-2 py-0" style="width:95%; font-size: 0.95em;" data-id="'+data.id+'" id="'+data.id+'">Править</button>';
                    }
                    return data;
                }
            },
        ],
        aoColumnDefs:[
            {
                "searchable": false,
                "aTargets": [0,6,7,10]
            },
            {
                //"visible": false,
                //"aTargets": [0]
            },
            {
                targets: [0,2,5,6,7,9,10],
                className: 'dt-body-center'
            },
            {
                targets: [2],
                createdCell : function (td, cellData, rowData, row, col) {
                    if ( cellData.length > 0 ) {
                      $(td).css('font-weight', 'bold');
                    }
                }
            },
            {
                targets:[7],
                type:'date'
            }
        ],
        language: {
            search: "Поиск : ",
            processing:     "Загружаю данные...",
            lengthMenu:     "<b class='text-info mx-3'></b>Отображать _MENU_ записей",
            info:           "Отображается от _START_ до _END_ из _TOTAL_ записей",
            infoEmpty:      "Найдено от 0 до 0 из 0 записей",
            infoFiltered:   "(фильтр из _MAX_ записей всего)",
            infoPostFix:    "",
            loadingRecords: "Ожидаю загрузки...",
            zeroRecords:    "Не найдено записей",
            emptyTable:     "Отсутствуют данные для таблицы",
            paginate: {
                first:      "Начало",
                previous:   "Пред",
                next:       "След",
                last:       "Конец"
            },
        },
        "lengthMenu": [ 20, 50, 100, 200 ],
        //"order": [ 0, 'desc' ],
    });

    $('#transportlist tbody').on('click', '.edit', function(elem){
        showItem(elem);
    });

}
// ************
function showItem(elem){
    $target = $(elem.target);
    var id = parseInt($target.attr('id'));
    if(id){
        showFormItem(id);
    }
    else{
        swal("Не могу открыть форму смены", "Попробуйте еще раз.", "warning");
    }
}
// ************

function showFormItem(recordid){
    let prdir = $('#prdir').text();
    $.ajax({
        type:'GET',
        // url: '../app/core/Routes.php/',
        url: '../'+prdir+'app/ajax/ajaxroutes.php/',
        data: { transport: recordid },
        cache: false,
        crossDomain: true,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data){
            let indata = data.data[0];
            let orgdata = data.data[1];
            let mvzdata = data.data[2].mvz;
            let sppdata = data.data[3].spp;        
            showContentItem(indata, orgdata, mvzdata, sppdata);  
        },
        error: function(err){
            console.log(err);
        }
    });
}

function showContentItem(indata, orgdata, mvzdata, sppdata){
    $('#ctrlwindowcontent').empty();
    $('#ctrlwindowtitle').text(indata.mark + ' ' + indata.num);
    let content = '';
        content += '<div class="form-group row mb-2"><label for="itemorg" class="col-sm-5 col-form-label text-info">Организация*</label>';
        //content += '<div class="col-sm-7"><input type="text" class="form-control text-center" id="itemorg" value="'+indata.org+'"  maxlength="50" placeholder="Укажите организацию..."/></div></div>';
        content += '<div class="col-sm-7">' + getOrgSelector(orgdata.orgs, indata.selorg) + '</div></div>';
        content += '<div class="form-group row mb-2"><label for="itemmark" class="col-sm-5 col-form-label text-info">Марка транспорта*</label>';
        content += '<div class="col-sm-7"><input type="text" class="form-control text-center" id="itemmark" value="'+indata.mark+'" maxlength="30" placeholder="МАЗ, Мерседес, РЕНО..." readonly/></div></div>'; 
        content += '<div class="form-group row mb-2"><label for="itemnum" class="col-sm-5 col-form-label text-info">Гос.номер* <small>(англ.!!!)</small></label>';
        content += '<div class="col-sm-7"><input type="text" class="form-control text-center" id="itemnum" value="'+indata.num+'" maxlength="12" placeholder="XX1234YY" readonly/></div></div>';     
        content += '<div class="form-group row mb-2"><label for="itemrfid" class="col-sm-5 col-form-label text-info">RFID-карточка</label>';
        content += '<div class="col-sm-7"><input type="text" class="form-control text-center" id="itemrfid" value="'+indata.rfid+'" maxlength="36" readonly/></div></div>';
        content += '<div class="form-group row mb-2"><label for="itemdriv" class="col-sm-5 col-form-label text-info">Ответств.лицо</label>';
        content += '<div class="col-sm-7"><input type="text" class="form-control text-center" id="itemdriv" value="'+indata.driv+'" maxlength="100" placeholder="Ф.И.О. (Иванов И. И.)"/></div></div>';        
        content += '<div class="form-group row mb-2"><label for="itemlim" class="col-sm-5 col-form-label text-info">Лимит топлива, л*</label>';
        content += '<div class="col-sm-7"><input type="number" class="form-control text-center" id="itemlim" min="-1" max="99999" value="'+indata.lim+'"/></div></div>';
        content += '<div class="form-group row mb-2"><label for="itemnotes" class="col-sm-5 col-form-label text-info">Примечания</label>';
        content += '<div class="col-sm-7"><input type="text" class="form-control text-center" id="itemnotes" value="'+indata.notes+'" maxlength="200"/></div></div>'; 
        content += '<div class="form-group row mb-2"><label for="itembind" class="col-sm-5 col-form-label text-info">Привязать к пункту налива</label>';
        content += '<div class="col-sm-7">';
        content += getBindSelector(bindArray, indata.bindto, false);
        content += '</div></div>';
        content += '<div class="form-group row mb-2"><label for="itemmvz" class="col-sm-5 col-form-label text-info">МВЗ</label>';
        content += '<div class="col-sm-7">';
        content += getMvzSelector(mvzdata, indata.mvz);
        content += '</div></div>';
        content += '<div class="form-group row mb-2"><label for="itemspp" class="col-sm-5 col-form-label text-info">СПП</label>';
        content += '<div class="col-sm-7">';
        content += getSppSelector(sppdata, indata.spp);
        content += '</div></div>';
        content += '<small class="text-black-50"><i>* - Не оставлять пустым;';
        if(userDepartment() == 2){
            content += '<br/>** - При изменении записи в систему iAZS будет сохранен только лимит';
            content += '<br/>*** - При изменении привязки к пункту Вы не сможете видеть запись';
        }
        content += '</i></small>';
    $('#ctrlwindowcontent').append(content);
    $('.modal-bottom').empty();
    //console.log(orgdata);
    let bottom = '<button class="btn btn-info pt-1 mr-2 pr-2" style="width:47%" id="saveitem">Сохранить</button>';
    bottom += '<button class="btn btn-outline-info pt-1 ml-2 pl-2" style="width:47%" type="button" data-dismiss="modal" aria-label="Close">Закрыть</button>';
    $('.modal-bottom').append(bottom);
    $("#saveitem").bind("click",function(elem){
        let savedata = {
            id : parseInt(indata.id),
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
        if(validateNewItem(savedata)){
            saveItem(savedata);
        }
    });
    $('#ctrlwindow').modal("show"); 
} 

function saveItem(savedata){
    let prdir = $('#prdir').text();
    $.ajax({
        type:'GET',
        // url: '../app/core/Routes.php/',
        url: '../'+prdir+'app/ajax/ajaxroutes.php/',
        data: { updtransport: JSON.stringify(savedata) },
        cache: false,
        crossDomain: true,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        beforeSend: function() {
            swal("Сохранение", "Подождите.\nСохраняю данные формы...", "success");
        },
        success: function(data){
            swal.close();
            if(data.data == true){
                $('#ctrlwindow').modal("hide"); 
                swal("Сохранено", "Данные успешно сохранены", "success").
                then(function(res){
                    window.location.reload(); 
                    /*
                    if ( $.fn.dataTable.isDataTable( '#transportlist' ) ) {
                        table = $('#transportlist').DataTable();
                        table.destroy();
                        listTableShow();
                    }
                    */
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
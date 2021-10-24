function showMeterWindow(ctrlId){
    $.ajax({
        type:'GET',
        //url: '../app/core/Routes.php/',
        url: '../app/ajax/ajaxroutes.php/',
        data: { elemid: ctrlId, elemtype : 'meters' },
        cache: false,
        crossDomain: true,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        beforeSend: function() {
            swal("Загрузка", "Подождите.\nЗагружаю данные формы...", "success");
        },
        success: function(data){
            swal.close();
            //(data.data != null) ? showMeterWindowContent(data) : swal("Нет данных", "Извините.\nНе могу получить данные\nУстройство id=" + ctrlId + ".", "warning");
            (data.data != null) ? showMeterFullContent(data) : swal("Нет данных", "Извините.\nНе могу получить данные\nУстройство id=" + ctrlId + ".", "warning");
        },
        error: function(err){
            console.log(err);
        }
    });
}

function showMeterFullContent(data){
    let indata = data.data;
    $('#fillpointwindowcontent').empty();
    $('#fillpointwindowtitle').text(indata.fulltitle);
    let content = '';
    content += '<table class="table table-sm" style="width:100%">';
        content += '<tr><td class="text-left">ID устройства</td><td class="text-right">'+ indata.web_name +'</td></tr>';
        content += '<tr><td class="text-left">Тип топлива</td><td class="text-right">'+ indata.fueltype +'</td></tr>';         
        content += '<tr><td class="text-left">Текущий объем, л</td><td class="text-right">'+ indata.vol +'</td></tr>'; 
        if(isEnCtrl() == 1 && (indata.web_name == "F1" || indata.web_name == "F2")){
            content += '<tr><td class="text-left">Задано, л</td><td class="text-right">';
            content += '<input type="number" id="cur_setp" class="text-center pr-1" style="width:50%" min="1" max="99999" value="'+indata.cur_setp+'"/>';
            content += '<button class="bg-info text-white upd_setp" id="'+indata.web_name+'"><small>Сохр.</small></button>';
            content += '</td></tr>'; 
        }
        else if(isEnCtrl() == 1 && (indata.web_name == "colNova")){
            content += '<tr><td class="text-left">Резер-р</td><td class="text-right">';
            content += '<select id="cur_setp">';
            if(indata.cur_setp == 4){
                content += '<option value="4" selected="selected">№11</option>';
                content += '<option value="5">№12</option>';
            }
            else{
                content += '<option value="4">№11</option>';
                content += '<option value="5" selected="selected">№12</option>';
            }
            content += '</select>';
            content += '<button class="bg-info text-white upd_setp" id="'+indata.web_name+'"><small>Сохр.</small></button>';
            content += '</td></tr>';
        }
        if(indata.mass != -1.0)
            content += '<tr><td class="text-left">Текущая масса, кг</td><td class="text-right">'+ indata.mass + '</td></tr>';  
        content += '<tr><td class="text-left">Суточный объем, л</td><td class="text-right">'+ indata.dailyvol + '</td></tr>'; 
        if(indata.dailymass != -1.0)
            content += '<tr><td class="text-left">Суточная масса, кг</td><td class="text-right">'+ indata.dailymass + '</td></tr>';                                   
        content += '<tr><td class="text-left">Суммарный объем, л</td><td class="text-right">'+ indata.sumvol + '</td></tr>';
        if(indata.summass != -1.0)
            content += '<tr><td class="text-left">Суммарная масса, кг</td><td class="text-right">'+ indata.summass + '</td></tr>';
        if(indata.temp != -1.0)   
            content += '<tr><td class="text-left">Температура, °C</td><td class="text-right">'+ indata.temp +'</td><td></td></tr>'; 
        if(indata.dens != -1.0)              
            content += '<tr><td class="text-left">Плотность, т/м3</td><td class="text-right">'+ indata.dens +'</td><td></td></tr>'; 
        content += '<tr><td class="text-left">Последний транспорт</td><td class="text-right">'+ indata.trans + '</td></tr>';
        if(indata.bitstatus!=0){
            let statusMask = {
                mehCtrl  : 0,
                minflow : 2,
                idnv   : 3,
                setpnv: 4,
                selfflow : 5,
                downloaded : 6,
                running : 7,
                stopped : 8,
                finished : 9
            };
            content += '<tr><td class="text-left">Статус налива:</td><td class="text-right"></td></tr>';
            if(Svg.getBit(indata.bitstatus,statusMask.finished)){
                content += '<tr><td class="text-left text-success">- налив завершен</td><td class="text-right"></td></tr>';
            }
            /*
            if(Svg.getBit(indata.bitstatus,statusMask.mehCtrl)){
                content += '<tr><td class="text-left text-danger">- контроль механизма</td><td class="text-right"></td></tr>';
            }
            */
            if(Svg.getBit(indata.bitstatus,statusMask.minflow)){
                content += '<tr><td class="text-left text-danger">- нет протока</td><td class="text-right"></td></tr>';
            }
            if(Svg.getBit(indata.bitstatus,statusMask.idnv)){
                content += '<tr><td class="text-left text-danger">- отуств id трансп</td><td class="text-right"></td></tr>';
            }
            if(Svg.getBit(indata.bitstatus,statusMask.setpnv)){
                content += '<tr><td class="text-left text-danger">- отсутств задание</td><td class="text-right"></td></tr>';
            }
            if(Svg.getBit(indata.bitstatus,statusMask.selfflow)){
                content += '<tr><td class="text-left text-danger">- самоход счетчика</td><td class="text-right"></td></tr>';
            }
            if(Svg.getBit(indata.bitstatus,statusMask.downloaded)){
                content += '<tr><td class="text-left">- загружено</td><td class="text-right"></td></tr>';
            }
            if(Svg.getBit(indata.bitstatus,statusMask.running)){
                content += '<tr><td class="text-left text-success">- выполняется</td><td class="text-right"></td></tr>';
            }
            if(Svg.getBit(indata.bitstatus,statusMask.stopped)){
                content += '<tr><td class="text-left">- остановлено</td><td class="text-right"></td></tr>';
            }            
        }

        content += '<tr><td class="text-left small text-black-50"><i>Дата измерения</i></td><td class="text-right small text-black-50"><i>'+ moment(indata.date).format('DD.MM.YYYY HH:mm:ss') +'</i></td></tr>';               
    content += '</table>';
    $('#fillpointwindowcontent').append(content);
    $('.modal-bottom').empty();
    let bottom = '<button class="btn btn-outline-info mt-1 mb-2" style="width:25%" type="button" data-dismiss="modal" aria-label="Close" onclick="window.location.reload()">Закрыть</button>';
    $('.modal-bottom').append(bottom);   
    
    $('#tablecontent').empty();
    content = '<table class="table table-sm table-responsive row-border hover pretty pt-0 display nowrap" ';
    content += 'style="width:100%; font-size:0.8em" id="fillpointtable" data-page-length="10">';          
    content += '<thead><tr class="text-center">';
    content += '<th class="fit">ID</th>';
    content += '<th class="col-2 px-3">Начато</th>';
    content += '<th class="col-2 px-3">Завершено</th>';
    content += '<th class="col-3 px-3">Организ-я</th>';
    content += '<th class="fit-wide">Марка</th>';
    content += '<th class="col-1">Номер</th>';
    content += '<th class="col-1">Задано,л</th>';
    content += '<th class="col-1">Отпущ,л</th>';
    content += '<th class="col-1">Масса,кг</th>';
    content += '<th class="col-1">Плотн,т/м3</th>';
    content += '<th class="col-1">Т-ра,°C</th>';
    content += '<th class="col-1">Куда</th>';
    content += '</tr></thead>';

    content += '<tfoot><tr class="text-center">';
    content += '<th class="fit">ID</th>';
    content += '<th class="col-2 px-3">Начато</th>';
    content += '<th class="col-2 px-3">Завершено</th>';
    content += '<th class="col-3 px-3">Организ-я</th>';
    content += '<th class="fit-wide">Марка</th>';
    content += '<th class="col-1">Номер</th>';
    content += '<th class="col-1">Задано,л</th>';
    content += '<th class="col-1">Отпущ,л</th>';
    content += '<th class="col-1">Масса,кг</th>';
    content += '<th class="col-1">Плотн,т/м3</th>';
    content += '<th class="col-1">Т-ра,°C</th>';
    content += '<th class="col-1">Куда</th>';
    content += '</tr></tfoot>';   
    content += '</table>'; 

    $('#tablecontent').append(content);
    createFillPointTable('fillpointtable', indata.web_name);

    $('#fillpointwindow').modal("show");

    $(".upd_setp").click(function(elem){
        let plc_n = $( this ).attr('id');
        let setpoint = $('#cur_setp').val();
        let prdir = $('#prdir').text();
        $.ajax({
            type:'GET',
            url: '../'+prdir+'app/ajax/ajaxroutes.php/',
            data: { updsetp: true, plc_n : plc_n, setpoint : setpoint },
            cache: false,
            crossDomain: true,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function(data){
                let sText = (data.data != 3) ? "Задание изменено на " + setpoint + " л." : "Резервуар-источник сохранен";
                swal("Сохранено", sText, "success").
                then(function(res){
                    window.location.reload();
                });
            },
            error: function(err){
                console.log(err);
            }
        }); 
    });

    $("#clsctrlwind").bind("click",function(elem){
        window.location.reload();
    });

}


function createFillPointTable(elem, web_name){
    let prdir = $('#prdir').text();
    let oTable = $('#' + elem).DataTable({
        dom: 'Bfrtip',
        buttons: [
            'copy',
            'excel',
            'csv'
        ],
        processing: false, // true for on-line
        serverSide: false, // true for on-line
        ajax: '../'+prdir+'app/ajax/ajaxroutes.php/?fillpoint=' + web_name,
        columns: [
            { data: 'id', name: 'id' },      // - 0
            { data: 'start', name: 'start', 
                "render" :  function ( data, type, full, meta ) {
                    return (data) ? moment(data).format('DD.MM.YYYY HH:mm:ss') : '---';
                }
            },      // - 1
            { data: 'finish', name: 'finish',
                "render" :  function ( data, type, full, meta ) {
                    return (data) ? moment(data).format('DD.MM.YYYY HH:mm:ss') : '---';
                }            
            },      // - 2 
            { data: 'org',  name: 'org'},    // - 3,
            { data: 'mark', name: 'mark' },  // - 4,
            { data: 'num', name: 'num',
                "render" :  function ( data, type, full, meta ) {
                    return (data == "BARABAN0663") ? "BAR0663" : data;
                }                    
            },    // - 5,
            { data: 'setvol',  name: 'setvol'},  // - 6,
            { data: 'actvol',  name: 'actvol'},  // - 7,
            { data: 'f_mass',  name: 'f_mass'},  // - 8,
            { data: 'dens',  name: 'dens'},  // - 9,  
            { data: 'temp',  name: 'temp'},  // - 10,          
            { data: 'dest',  name: 'dest'}  // - 11,            
        ],
        aoColumnDefs:[
            {
                "searchable": false,
                "aTargets": [0,1,2,6,7,8,9,10]
            },
            {
                "visible": false,
                "aTargets": [0,3,11]
            },
            {
                targets: [0,5,6,7,8,9,10],
                className: 'dt-body-center'
            },
            {
                targets: [0,1,2,3,4,5,6,7,8,9,10,11],
                createdCell : function (td, cellData, rowData, row, col) {
                    let padding = 2 + 'px';
                    $(td).css('width', '100%');
                    $(td).css('padding-top', padding);
                    $(td).css('padding-bottom', padding);
                    //$(td).addClass('px-2 py-1');
                }
            },
            {
                targets:[1,2],
                type:'date'
            }
        ],
        language: {
            search: "Поиск : ",
            processing:     "Загружаю данные...",
            //lengthMenu:     "<b class='text-info mx-3'>Таблица наливов</b>Отображать _MENU_ записей",
            lengthMenu:     "<b class='mx-3'>Таблица наливов</b>",
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
            //buttons: [
            //    'copy', 'csv', 'excel', 'pdf', 'print'
            //]
        },
        //"lengthMenu": [ 10 ],
        "order": [ 0, 'desc' ],
    });
}

// ******** for local store, azs and railway stations Page ********

function showDataTable(elem, names, exportEn){
    $('#' + elem).empty();
    content = '<table class="table table-sm table-responsive row-border hover display compact nowrap" ';
    content += 'style="width:100%; font-size:0.8em" id="table'+elem+'" data-page-length="30">';          
    content += '<thead><tr class="text-center">';
    content += '<th class="text-center">ID</th>';
    content += '<th class="text-center">Узел отпуска</th>';
    content += '<th class="text-center">Начато</th>';
    content += '<th class="text-center">Завершено</th>';
    content += '<th class="text-center fit">Госномер</th>';
    content += '<th class="text-center">Задано,л</th>';
    content += '<th class="text-center">Отпущ.,л</th>';
    content += '<th class="text-center">Темп-ра</th>';
    content += '<th class="text-center">Плотн.</th>';
    content += '<th class="text-center">Масса,кг</th>';
    content += '<th class="text-center">Куда</th>';
    content += '<th class="text-center">Закрыто</th>';  
    content += '<th class="text-center">Тип</th>';  
    content += '<th class="text-center">id_z</th>';    
    content += '</tr></thead>';
    content += '</table>'; 
    $('#' + elem).append(content);
    createLocalTable('table' + elem, names, exportEn);
}

function showWideDataTable(elem, names, exportEn){
    $('#' + elem).empty();
    content = '<table class="table table-sm table-responsive row-border hover display compact nowrap" ';
    content += 'style="width:100%; font-size:0.8em" id="table'+elem+'" data-page-length="30">';          
    content += '<thead><tr class="text-center">';
    content += '<th class="text-center">ID</th>';
    content += '<th class="text-center">Узел отпуска</th>';
    content += '<th class="text-center">Начато</th>';
    content += '<th class="text-center">Завершено</th>';
    content += '<th class="text-center fit">Госномер</th>';
    content += '<th class="text-center">Задано,л</th>';
    content += '<th class="text-center">Отпущ.,л</th>';
    content += '<th class="text-center">Темп-ра</th>';
    content += '<th class="text-center">Плотн.</th>';
    content += '<th class="text-center">Масса,кг</th>';
    content += '<th class="text-center">Куда</th>';
    content += '<th class="text-center">Закрыто</th>';  
    content += '<th class="text-center">Тип</th>'; 
    content += '<th class="text-center">МВЗ транспорта</th>';
    content += '<th class="text-center">СПП транспорта</th>';  
    content += '<th class="text-center">id_z</th>';    
    content += '</tr></thead>';
    content += '</table>'; 
    $('#' + elem).append(content);
    createWideTable('table' + elem, names, exportEn);
}

function createLocalTable(elem, names, exportbtns){
    let prdir = $('#prdir').text();
    $.fn.dataTable.ext.classes.sPageButton = 'btn btn-sm btn-outline-dark border-0';
    $.fn.dataTable.ext.classes.sPageButtonActive = 'text-info font-weight-bold';

    if(exportbtns === true){
        let oTable = $('#' + elem).DataTable({
            dom: 'Bfrtip',
            buttons: [
                'copy',
                'excel',
                'csv'
            ],
            processing: false, // true for on-line
            serverSide: false, // true for on-line
            ajax: '../'+prdir+'app/ajax/ajaxroutes.php/?points=' + names,
            columns: [
                { data: 'id', name: 'id' },      // - 0
                { data: 'title', name: 'title' },      // - 1            
                { data: 'start', name: 'start', 
                    "render" :  function ( data, type, full, meta ) {
                        return (data) ? moment(data).format('DD.MM.YYYY HH:mm:ss') : '---';
                    }
                },      // - 2
                { data: 'finish', name: 'finish',
                    "render" :  function ( data, type, full, meta ) {
                        return (data) ? moment(data).format('DD.MM.YYYY HH:mm:ss') : '---';
                    }            
                },      // - 3 
                { data: 'num', name: 'num',
                    "render" :  function ( data, type, full, meta ) {
                        return (data == "BARABAN0663") ? "BAR0663" : data;
                        //console.log(data);
                    }
                },    // - 4,
                { data: 'setvol',  name: 'setvol'},  // - 5,
                { data: 'actvol',  name: 'actvol'},  // - 6,
                { data: 'temp',  name: 'temp'},  // - 7,
                { data: 'dens',  name: 'dens'},  // - 8,
                { data: 'f_mass',  name: 'f_mass'},  // - 9,
                { data: 'dest',  name: 'dest'},  // - 10,   
                { data: 'closed',  name: 'closed'} , // - 11,
                { data: 'fueltype',  name: 'fueltype'} , // - 12,    
                { data: 'id_z',  name: 'id_z'}  // - 13,      
            ],
            aoColumnDefs:[
                {   "searchable": false,  "aTargets": [0,2,3,5,6,7,8,9,11,13]   },
                {   "visible": false, "aTargets": [11,13] },
                {
                    targets: [0,4,5,6,7,8,9,10,12],
                    className: 'dt-body-center'
                },
                {
                    targets: [0,1,2,3,4,5,6,7,8,9,10,11,12,13],
                    createdCell : function (td, cellData, rowData, row, col) {
                        $(td).addClass('py-0 my-0 px-2');
                    }
                }
            ],
            createdRow : function( row, data, dataIndex ) {
                if (data.finish == null){
                    $(row).addClass( 'bg-warning' );
                }
                else if ( data.closed == null) {
                    $(row).removeClass( 'bg-warning' );
                    $(row).addClass( 'bg-success' );
                }
                //$(row).dblclick(function(){
                $(row).dblclick(function(){
                    getSingleFill(data.id);
                }); 
                /*
                else if( data.id_z == -2) {
                    $(row).addClass( 'bg-secondary' );
                }
                */
            },
            language: {
                search: "Поиск : ",
                processing:     "Загружаю данные...",
                //lengthMenu:     "<b class='mx-3'>Таблица наливов</b>Отображать _MENU_ записей",
                lengthMenu:     "<b class='mx-3'>Таблица наливов</b>",
                info:           "<small>Отображается от _START_ до _END_ из _TOTAL_ записей</small>",
                infoEmpty:      "<small>Найдено от 0 до 0 из 0 записей</small>",
                infoFiltered:   "<small>(фильтр из _MAX_ записей всего)</small>",
                infoPostFix:    "",
                loadingRecords: "Ожидаю загрузки...",
                zeroRecords:    "Не найдено записей",
                emptyTable:     "Отсутствуют данные для таблицы",
                paginate: {
                    first:      "Начало",
                    previous:   "Пред",
                    next:       "След",
                    last:       "Конец"
                }
            },
            "lengthMenu": [ 35, 70, 200],
            "order": [ 0, 'desc' ],
        });
    }
    else{
        let oTable = $('#' + elem).DataTable({
            processing: false, // true for on-line
            serverSide: false, // true for on-line
            ajax: '../'+prdir+'app/ajax/ajaxroutes.php/?points=' + names,
            columns: [
                { data: 'id', name: 'id' },      // - 0
                { data: 'title', name: 'title' },      // - 1            
                { data: 'start', name: 'start', 
                    "render" :  function ( data, type, full, meta ) {
                        return (data) ? moment(data).format('DD.MM.YYYY HH:mm:ss') : '---';
                    }
                },      // - 2
                { data: 'finish', name: 'finish',
                    "render" :  function ( data, type, full, meta ) {
                        return (data) ? moment(data).format('DD.MM.YYYY HH:mm:ss') : '---';
                    }            
                },      // - 3 
                { data: 'num', name: 'num',
                    "render" :  function ( data, type, full, meta ) {
                        return (data == "BARABAN0663") ? "BAR0663" : data;
                        //console.log(data);
                    }
                },    // - 4,
                { data: 'setvol',  name: 'setvol'},  // - 5,
                { data: 'actvol',  name: 'actvol'},  // - 6,
                { data: 'temp',  name: 'temp'},  // - 7,
                { data: 'dens',  name: 'dens'},  // - 8,
                { data: 'f_mass',  name: 'f_mass'},  // - 9,
                { data: 'dest',  name: 'dest'},  // - 10,   
                { data: 'closed',  name: 'closed'} , // - 11,
                { data: 'fueltype',  name: 'fueltype'} , // - 12,    
                { data: 'id_z',  name: 'id_z'}  // - 13,      
            ],
            aoColumnDefs:[
                {   "searchable": false,  "aTargets": [0,2,3,5,6,7,8,9,11,13]   },
                {   "visible": false, "aTargets": [11,13] },
                {
                    targets: [0,4,5,6,7,8,9,10,12],
                    className: 'dt-body-center'
                },
                {
                    targets: [0,1,2,3,4,5,6,7,8,9,10,11,12,13],
                    createdCell : function (td, cellData, rowData, row, col) {
                        $(td).addClass('py-0 my-0 px-2');
                    }
                }
            ],
            createdRow : function( row, data, dataIndex ) {
                if (data.finish == null){
                    $(row).addClass( 'bg-warning' );
                }
                else if ( data.closed == null) {
                    $(row).removeClass( 'bg-warning' );
                    $(row).addClass( 'bg-success' );
                }
                //$(row).dblclick(function(){
                $(row).dblclick(function(){
                    getSingleFill(data.id);
                }); 
                /*
                else if( data.id_z == -2) {
                    $(row).addClass( 'bg-secondary' );
                }
                */
            },
            language: {
                search: "Поиск : ",
                processing:     "Загружаю данные...",
                //lengthMenu:     "<b class='mx-3'>Таблица наливов</b>Отображать _MENU_ записей",
                lengthMenu:     "<b class='mx-3'>Таблица наливов</b>",
                info:           "<small>Отображается от _START_ до _END_ из _TOTAL_ записей</small>",
                infoEmpty:      "<small>Найдено от 0 до 0 из 0 записей</small>",
                infoFiltered:   "<small>(фильтр из _MAX_ записей всего)</small>",
                infoPostFix:    "",
                loadingRecords: "Ожидаю загрузки...",
                zeroRecords:    "Не найдено записей",
                emptyTable:     "Отсутствуют данные для таблицы",
                paginate: {
                    first:      "Начало",
                    previous:   "Пред",
                    next:       "След",
                    last:       "Конец"
                }
            },
            "lengthMenu": [ 35, 70, 200],
            "order": [ 0, 'desc' ],
        });
    }
}

function createWideTable(elem, names, exportbtns){
    let prdir = $('#prdir').text();
    $.fn.dataTable.ext.classes.sPageButton = 'btn btn-sm btn-outline-dark border-0';
    $.fn.dataTable.ext.classes.sPageButtonActive = 'text-info font-weight-bold';

    if(exportbtns === true){
        let oTable = $('#' + elem).DataTable({
            dom: 'Bfrtip',
            buttons: [
                'copy',
                'excel',
                'csv'
            ],
            processing: false, // true for on-line
            serverSide: false, // true for on-line
            ajax: '../'+prdir+'app/ajax/ajaxroutes.php/?points=' + names,
            columns: [
                { data: 'id', name: 'id' },      // - 0
                { data: 'title', name: 'title' },      // - 1            
                { data: 'start', name: 'start', 
                    "render" :  function ( data, type, full, meta ) {
                        return (data) ? moment(data).format('DD.MM.YYYY HH:mm:ss') : '---';
                    }
                },      // - 2
                { data: 'finish', name: 'finish',
                    "render" :  function ( data, type, full, meta ) {
                        return (data) ? moment(data).format('DD.MM.YYYY HH:mm:ss') : '---';
                    }            
                },      // - 3 
                { data: 'num', name: 'num',
                    "render" :  function ( data, type, full, meta ) {
                        return (data == "BARABAN0663") ? "BAR0663" : data;
                        //console.log(data);
                    }
                },    // - 4,
                { data: 'setvol',  name: 'setvol'},  // - 5,
                { data: 'actvol',  name: 'actvol'},  // - 6,
                { data: 'temp',  name: 'temp'},  // - 7,
                { data: 'dens',  name: 'dens'},  // - 8,
                { data: 'f_mass',  name: 'f_mass'},  // - 9,
                { data: 'dest',  name: 'dest'},  // - 10,   
                { data: 'closed',  name: 'closed'} , // - 11,
                { data: 'fueltype',  name: 'fueltype'} , // - 12,
                { data: 'mvz',  name: 'mvz'} , // - 13,  
                { data: 'spp',  name: 'spp'} , // - 14,                  
                { data: 'id_z',  name: 'id_z'}  // - 15,      
            ],
            aoColumnDefs:[
                {   "searchable": false,  "aTargets": [0,2,3,5,6,7,8,9,11,15]   },
                {   "visible": false, "aTargets": [11,15] },
                {
                    targets: [0,4,5,6,7,8,9,10,12,13,14],
                    className: 'dt-body-center'
                },
                {
                    targets: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
                    createdCell : function (td, cellData, rowData, row, col) {
                        $(td).addClass('py-0 my-0 px-2');
                    }
                }
            ],
            createdRow : function( row, data, dataIndex ) {
                if (data.finish == null){
                    $(row).addClass( 'bg-warning' );
                }
                else if ( data.closed == null) {
                    $(row).removeClass( 'bg-warning' );
                    $(row).addClass( 'bg-success' );
                }
                $(row).dblclick(function(){
                    getSingleFill(data.id);
                }); 
            },
            language: {
                search: "Поиск : ",
                processing:     "Загружаю данные...",
                //lengthMenu:     "<b class='mx-3'>Таблица наливов</b>Отображать _MENU_ записей",
                lengthMenu:     "<b class='mx-3'>Таблица наливов</b>",
                info:           "<small>Отображается от _START_ до _END_ из _TOTAL_ записей</small>",
                infoEmpty:      "<small>Найдено от 0 до 0 из 0 записей</small>",
                infoFiltered:   "<small>(фильтр из _MAX_ записей всего)</small>",
                infoPostFix:    "",
                loadingRecords: "Ожидаю загрузки...",
                zeroRecords:    "Не найдено записей",
                emptyTable:     "Отсутствуют данные для таблицы",
                paginate: {
                    first:      "Начало",
                    previous:   "Пред",
                    next:       "След",
                    last:       "Конец"
                }
            },
            "lengthMenu": [ 35, 70, 200],
            "order": [ 0, 'desc' ],
        });
    }
    else{
        let oTable = $('#' + elem).DataTable({
            processing: false, // true for on-line
            serverSide: false, // true for on-line
            ajax: '../'+prdir+'app/ajax/ajaxroutes.php/?points=' + names,
            columns: [
                { data: 'id', name: 'id' },      // - 0
                { data: 'title', name: 'title' },      // - 1            
                { data: 'start', name: 'start', 
                    "render" :  function ( data, type, full, meta ) {
                        return (data) ? moment(data).format('DD.MM.YYYY HH:mm:ss') : '---';
                    }
                },      // - 2
                { data: 'finish', name: 'finish',
                    "render" :  function ( data, type, full, meta ) {
                        return (data) ? moment(data).format('DD.MM.YYYY HH:mm:ss') : '---';
                    }            
                },      // - 3 
                { data: 'num', name: 'num',
                    "render" :  function ( data, type, full, meta ) {
                        return (data == "BARABAN0663") ? "BAR0663" : data;
                        //console.log(data);
                    }
                },    // - 4,
                { data: 'setvol',  name: 'setvol'},  // - 5,
                { data: 'actvol',  name: 'actvol'},  // - 6,
                { data: 'temp',  name: 'temp'},  // - 7,
                { data: 'dens',  name: 'dens'},  // - 8,
                { data: 'f_mass',  name: 'f_mass'},  // - 9,
                { data: 'dest',  name: 'dest'},  // - 10,   
                { data: 'closed',  name: 'closed'} , // - 11,
                { data: 'fueltype',  name: 'fueltype'} , // - 12,
                { data: 'mvz',  name: 'mvz'} , // - 13,  
                { data: 'spp',  name: 'spp'} , // - 14,                  
                { data: 'id_z',  name: 'id_z'}  // - 15,      
            ],
            aoColumnDefs:[
                {   "searchable": false,  "aTargets": [0,2,3,5,6,7,8,9,11,15]   },
                {   "visible": false, "aTargets": [11,15] },
                {
                    targets: [0,4,5,6,7,8,9,10,12,13,14],
                    className: 'dt-body-center'
                },
                {
                    targets: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
                    createdCell : function (td, cellData, rowData, row, col) {
                        $(td).addClass('py-0 my-0 px-2');
                    }
                }
            ],
            language: {
                search: "Поиск : ",
                processing:     "Загружаю данные...",
                //lengthMenu:     "<b class='mx-3'>Таблица наливов</b>Отображать _MENU_ записей",
                lengthMenu:     "<b class='mx-3'>Таблица наливов</b>",
                info:           "<small>Отображается от _START_ до _END_ из _TOTAL_ записей</small>",
                infoEmpty:      "<small>Найдено от 0 до 0 из 0 записей</small>",
                infoFiltered:   "<small>(фильтр из _MAX_ записей всего)</small>",
                infoPostFix:    "",
                loadingRecords: "Ожидаю загрузки...",
                zeroRecords:    "Не найдено записей",
                emptyTable:     "Отсутствуют данные для таблицы",
                paginate: {
                    first:      "Начало",
                    previous:   "Пред",
                    next:       "След",
                    last:       "Конец"
                }
            },
            "lengthMenu": [ 35, 70, 200],
            "order": [ 0, 'desc' ],
        });
    }
}
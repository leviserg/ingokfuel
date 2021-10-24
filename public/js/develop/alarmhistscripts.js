
$(document).ready(function(){
    $('#pagetitle').text('Участки');
    alarmActTableShow();    
    alarmHistTableShow();
});

function alarmActTableShow() {
    let prdir = $('#prdir').text();
    var oTable = $('#alarmactttable').DataTable({
        processing: false, // true for on-line
        serverSide: false, // true for on-line
        ajax: '../'+prdir+'app/ajax/ajaxroutes.php/?getactalarms=' + true,
        columns: [
            { data: 'id', name: 'id' },                             // - 0
            { data: 'recdate',
                name: 'recdate',
                "render": function ( data, type, full, meta ) {
                    return (data) ? moment(data).format('DD.MM.YYYY HH:mm:ss') : '---';
                }
            },
            { data: 'description', name: 'description' }, 
            { data: 'status',
                name: 'status',
                "render": function ( data, type, full, meta ) {
                    return (data>0) ? 'Возник' : 'Уход';
                }
            }
        ],
        aoColumnDefs:[
            {
                "searchable": false,
                "aTargets": [0,1]
            },
            {
                "visible": false,
                // "aTargets": [0]
            },
            {
                targets: [0,1,3],
                className: 'dt-body-center'
            },
            {
                targets: [0,1,2,3],
                className: 'py-0 my-0'
            }
        ],
        language: {
            search: "Поиск в описании : ",
            processing:     "Загружаю данные...",
            lengthMenu:     "<b class='text-danger mx-3'>Активные аварии. </b>",
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
        "createdRow": function ( row, data, index ) {
            var obj = data;
            if ( obj.status > 0) { // Alarm
                for(let i = 0; i < 3; i++){
                    $('td', row).eq(i).addClass('text-danger font-weight-bold');                    
                }
            }
        },
        "order": [ 1, 'desc' ]
    });
}

function alarmHistTableShow() {
    let prdir = $('#prdir').text();
    var oTable = $('#alarmhisttable').DataTable({
        processing: false, // true for on-line
        serverSide: false, // true for on-line
        ajax: '../'+prdir+'app/ajax/ajaxroutes.php/?getalarmhist=' + true,
        columns: [
            { data: 'id', name: 'id' },                             // - 0
            { data: 'recdate',
                name: 'recdate',
                "render": function ( data, type, full, meta ) {
                    return (data) ? moment(data).format('DD.MM.YYYY HH:mm:ss') : '---';
                }
            },
            { data: 'description', name: 'description' }, 
            { data: 'status',
                name: 'status',
                "render": function ( data, type, full, meta ) {
                    return (data>0) ? 'Возник' : 'Уход';
                }
            }
        ],
        aoColumnDefs:[
            {
                "searchable": false,
                "aTargets": [0,1]
            },
            {
                "visible": false,
                // "aTargets": [0]
            },
            {
                targets: [0,1,3],
                className: 'dt-body-center'
            },
            {
                targets: [0,1,2,3],
                className: 'py-0 my-0'
            }
        ],
        language: {
            search: "Поиск в описании : ",
            processing:     "Загружаю данные...",
            lengthMenu:     "<b class='mx-3'>История аварий. </b>Отображать _MENU_ записей",
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
        "lengthMenu": [ 12, 50, 100, 200 ],
        "createdRow": function ( row, data, index ) {
            var obj = data;
            if ( obj.status > 0) { // Alarm
                for(let i = 0; i < 3; i++){
                    $('td', row).eq(i).addClass('text-danger font-weight-bold');                    
                }
            }
        },
        "order": [ 0, 'desc' ]
    });
}
$(document).ready(function(){
    userHistTableShow();
});

// *******************
// **** functions ****
// *******************

function userHistTableShow() {
    let prdir = $('#prdir').text();
    var oTable = $('#userhist-table').DataTable(
    {
        processing: false, // true for on-line
        serverSide: false, // true for on-line
        ajax: '../'+prdir+'app/ajax/ajaxroutes.php/?usershist',
        columns: [
            { data: 'id', name: 'id' },                             // - 0
            { data: 'login', name: 'login' },                       // - 1
            { data: 'enctrl',
                name: 'enctrl',
                "render" : function ( data, type, full, meta ) {
                    if(data == 1)
                        return 'разрешен';
                    else
                        return '-';
                }
            }, 
            { data: 'loggedin',
                name: 'loggedin',
                "render" : function ( data, type, full, meta ) {
                    return moment(data).format('DD.MM.YYYY HH:mm:ss');
                }
            }, 
            { data: 'loggedout',
                name: 'loggedout',
                "render" : function ( data, type, full, meta ) {
                    if(data)
                        return moment(data).format('DD.MM.YYYY HH:mm:ss');
                    else
                        return '-';
                }
            },                                                   // - 1
                        // - 2
            { data: 'ipaddr', name: 'ipaddr' },                       // - 3
            { data: 'country', name: 'country' } ,                       // - 4
            { data: 'region', name: 'region' } ,
            { data: 'city', name: 'city' }     
        ],
        aoColumnDefs:[
            {
                "searchable": false,
                "aTargets": [0]
            },
            {
                targets: [0,2,3,4,5,6,7],
                className: 'dt-body-center'
            },
            {
                targets: [1],
                className: 'pl-4'
            }
        ],
        language: {
            search: "Поиск в описании : ",
            processing:     "Загружаю данные...",
            lengthMenu:     "<b class='ml-3'>ИСТОРИЯ ПОЛЬЗОВАТЕЛЕЙ. </b>Отображать _MENU_ записей",
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
        "order": [ 0, 'desc' ],
    }
);
/*
setInterval( function () {
    oTable.ajax.reload( null, false );
}, updatePeriod*1000 );
*/
}
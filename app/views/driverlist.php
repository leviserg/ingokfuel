<div class="container-fluid mt-2 pr-4 pl-2">
    <div class="row py-2 pr-4">
        <div class="col-md-2 text-center">
            <button type="button" class="btn btn-outline-info" style="width: 160px; border:none" id="newitem">Добавить...</button>
        </div>
        <div class="col-md-8 text-center">
            <h3>Справочник транспортных средств и участков</h3>
        </div>
        <div class="col-md-2 text-center pr-4">
            <button type="button" class="btn btn-outline-info px-3" style="border:none" id="destlist">Производственные участки</button>
        </div>
    </div>

    <table class="table table-sm table-responsive row-border hover display compact pretty pt-0 mb-3"
        cellpadding="0" cellspacing="0" style="width:100%; font-size:0.84em" id="transportlist" data-page-length='20'>
        <thead>
            <tr class="text-center">
                <th class="text-center">ID</th>
                <th class="text-center">Марка (тип)</th>
                <th class="text-center fit">Гос. номер</th>
                <th class="text-center">Организация</th>
                <th class="text-center">Ответств. лицо</th>
                <th class="text-center">Привязка</th>
                <th class="text-center">Лимит топлива,л</th>
                <th class="text-center">Сохранено</th>
                <th class="text-center">Примечания</th>
                <th class="text-center">МВЗ</th>
                <th class="text-center">Правка</th>
            </tr>
        </thead>
    </table>

</div>
<?php require "modals/ctrlwindow.php" ?>
<?php require "modals/destwindow.php" ?>
<script src="public/js/develop/driverlist.js"></script>
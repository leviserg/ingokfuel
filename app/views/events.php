<div class="row mt-4 pt-4">
    <div class="col-md-12" style="width:100%; height:auto" id="eventstablecontent">
    </div>
</div>
<?php if ($_SESSION['user']['department']==0): ?>
    <div class="row mt-2">
        <div class="col-md-3 text-right ml-auto mr-0">
            <button class="btn btn-sm btn-info mx-2 px-2" data-toggle="tooltip" title="Создать отчет по наливах" id="addreport" style="width:150px">Создать отчет</button>
            <button class="btn btn-sm btn-info mx-2 px-2 monreport" data-toggle="tooltip" title="Создать суммарный отчет (н-р: за месяц)" id="mAll" style="width:150px">Суммарный отчет</button>
        </div>
    </div>
<?php endif ?>

<?php 
    require "modals/ctrlwindow.php";
?>

<script src="public/js/develop/eventscripts.js"></script>
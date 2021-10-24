<?php   if ($_SESSION['user']['department']==0 || $_SESSION['user']['department']==1): ?>
    <div class="container-fluid mt-4" id="content">
        <div class="row">
            <div class="col-md-5 px-0 mx-0 text-left" style="width:100%">
                <?php require "mnemos/localstore.php" ?>
                <div class="row mt-2">
                    <div class="col-md-12 text-right ml-auto mr-0">
                        <button class="btn btn-sm btn-success  mx-2 px-2 addfill" id="F1" data-toggle="tooltip" title="Заполнить форму налива вручную" style="width:20%">Добавить данные</button>
                        <button class="btn btn-sm btn-info mx-2 px-2 monreport" data-toggle="tooltip" title="Создать суммарный отчет (н-р: за месяц)" id="mF1" style="width:20%">Суммарный отчет</button>
                        <button class="btn btn-sm btn-info" data-toggle="tooltip" title="Создать отчет по наливам" id="addreport" style="width:20%">Создать отчет</button>
                    </div>
                </div>
            </div>
            <div class="col-md-7 px-0 mx-0" style="width:100%">
                <div class="row mt-2">
                    <div class="container-fluid ml-0 mr-1" style="width:100%">
                        <div class="col-md-12" style="width:100%; height:auto" id="localstoretablecontent">
                        </div>
                    </div>
                </div>             
            </div>
        </div>
    </div>

    <?php 
        require "modals/ctrlwindow.php";
        require "modals/leveltrendwindow.php";
        require "modals/fillpointwindow.php";
    ?>

    <script src="public/js/develop/localstorescripts.js"></script>
<?php else: ?>
    <h1 style="text-align: center; margin-top:200px" class="text-info">Доступ запрещен</h1><br/>
    <p style="text-align: center" class="text-info"><b>Вы пытаетесь зайти на закрытую для просмотра страницу</b></p>
    <!-- <p style="text-align: center"></p> -->
<?php endif ?>
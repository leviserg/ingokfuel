<div class="container-fluid">
    <div class="row mt-4">
        <div class="col-md-10">
            <div id="maintrends" style="width:100%; height:840px">

            </div>
        </div>
        <div class="col-md-2 mt-2">
            <div id="exportdiv"></div>
            <h6 class="text-info ml-3"><b>Выбрать резервуар</b></h6>
            <div class="container ml-0 mt-4" id="rlist">
                <?php
                    require 'app/core/models/CurData.php';
                    use app\core\CurData;
                    $tanks = CurData::getTanks();
                    foreach($tanks as $tank){
                        $radio = "<div class='form_radio'>";
                        if($tank['web_name'] === 'R22'){
                            $radio .= "<input id='".$tank['web_name']."' type='radio' name='rdtank' value='".$tank['fulltitle']."' checked>";
                        }
                        else{
                            $radio .= "<input id='".$tank['web_name']."' type='radio' name='rdtank' value='".$tank['fulltitle']."'>";
                        }
                        $radio .= "<label id='l".$tank['web_name']."' for='".$tank['web_name']."'>".$tank['fulltitle']." <small class='text-black-50'><i>{ ".$tank['fueltype']." }</i></small></label>";
                        $radio .= "</div>";
                        echo $radio;
                    }
                ?>
            </div>                     
        </div>
    </div>
</div>

<script src="public/js/develop/trendspage.js"></script>
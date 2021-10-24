<h4 class="text-center mt-3">Отчеты для Medoc</h4>
<div class="container text-center" style="width:100%">
    <div class="row">
            <?php
                require 'app/core/models/ReportData.php';
                use app\core\ReportData;
                $datalimit = 360;
                $reports = ReportData::getReports($datalimit);
                $repsklad = [];
                $repprom = [];
                foreach($reports as $report){
                    $datefmt = date('d.m.Y', strtotime($report['createdate'].' - 1 DAYS'));
                    $title = substr($report["filename"],-4);
                    $title = str_replace("_","",$title);
                    if($title === "gsm"){
                        $titlefull = "Склад ГСМ + АЗС + ЖДЦ Отв";
                        $currep = [
                            'date' => $datefmt,
                            'title' => $titlefull,
                            'filename' => $report["filename"]
                        ];
                        array_push($repsklad, $currep);
                    }
                    else{
                        $titlefull = "ЖДЦ Промышленная"; // ($title === "prom")  
                        $currep = [
                            'date' => $datefmt,
                            'title' => $titlefull,
                            'filename' => $report["filename"]
                        ];
                        array_push($repprom, $currep);                 
                    }
                }
                $tcontent = "";
                $tcontent = "<div class='col-md-5 px-4 mx-4 text-left'><p class='ml-4 text-center'>Склад ГСМ</p>";
                for($i=0; $i < count($repsklad); $i++){
                    $tcontent.= '<a class="btn btn-sm py-0 btn-outline-info px-2" style="width:450px" href="/public/reports/'.$repsklad[$i]["filename"].'.xml" download>';
                    $tcontent.= $repsklad[$i]["title"].' / Отчет за '.$repsklad[$i]["date"].'  <i class="fa fa-download mx-2"></i> </a><br/>';
                }
                $tcontent .= "</div>";
                $tcontent .= "<div class='col-md-5 px-4 mx-4 text-left'><p class='ml-4 text-center'>ЖДЦ Промышленная</p>";
                for($i=0; $i < count($repprom); $i++){
                    $tcontent.= '<a class="btn btn-sm py-0 btn-outline-info px-2" style="width:450px" href="/public/reports/'.$repprom[$i]["filename"].'.xml" download>';
                    $tcontent.= $repprom[$i]["title"].' / Отчет за '.$repprom[$i]["date"].'  <i class="fa fa-download mx-2"></i> </a><br/>';
                }
                $tcontent .= "</div>";
                echo $tcontent;
            ?>
    </div>
</div>
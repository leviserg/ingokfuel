<?php

    require_once __DIR__.'/./exceltools/SimpleXLSXGen.php';
    require_once __DIR__.'/ReportData.php';
    use app\core\ReportData;

    class ExcelReport {

        public static function createReport($data){
            try{
                $jsondata = json_decode($data,true);
                $startdate = $jsondata["startdate"];
                $enddate = $jsondata["enddate"];
                $filename = $jsondata["filename"];
                $rootdirname = dirname(__DIR__, 3);
                $localfilepath = '/public/reports/excelreports/'.$filename.'.xlsx';
                $filepath = $rootdirname.$localfilepath;
                $reportdata = [
                    ["",'Заправки с '.$startdate.' по '.$enddate],
                    ['Цех','Бензовоз','Гос.номер', 'Пуск', 'Стоп', 'Масса, кг', 'Объем, л', 'Плотность, т/м3','Температура, °C','План объем, л','Топливо', "Узел учета", "Резервуар","МВЗ","МВЗ описание","СПП" ]
                ];
                $sqldata = ReportData::createExcelReport($data);
                if(count($sqldata) > 0){
                foreach($sqldata as $record){
                    $recdata = [];
                    foreach($record as $recordfield){
                        array_push($recdata, $recordfield);
                    }
                    array_push($reportdata, $recdata);
                }
                $xlsx = SimpleXLSXGen::fromArray( $reportdata );
                $xlsx->saveAs($filepath);
                //  $xlsx->downloadAs('books.xlsx');
                return $localfilepath;
                }
                else{
                    return -1;
                }
            }
            catch(Exception $e){
                die($e);
            }
        }

        public static function createMonthReport($data){
            try{
                $jsondata = json_decode($data,true);
                $startdate = $jsondata["startdate"];
                $enddate = $jsondata["enddate"];
                $filename = $jsondata["filename"];
                $rootdirname = dirname(__DIR__, 3);
                $localfilepath = '/public/reports/excelreports/'.$filename.'.xlsx';
                $filepath = $rootdirname.$localfilepath;
                $reportdata = [
                    ["",'Сум Объем по ТС с '.$startdate.' по '.$enddate],
                    ['№п/п','Марка','Гос.номер', 'Д/т', 'A-92', 'Керосин','МВЗ','МВЗ описание','СПП']
                ];
                $sqldata = ReportData::createMonthExcelReport($data);
                if(count($sqldata) > 0){
                    $rownum = 1;
                    $sumDT = 0;
                    $sumA92 = 0;
                    $sumKER = 0;
                    foreach($sqldata as $record){
                        $recdata = [$rownum, $record['mark'], $record['num'], intval($record['f_vol']) * intval($record['DT']), intval($record['f_vol']) * intval($record['A92']),intval($record['f_vol']) * intval($record['KER']), $record['mvz'], $record['mvz_desc'], $record['spp'] ];
                        $sumDT += intval($record['f_vol']) * intval($record['DT']);
                        $sumA92 += intval($record['f_vol']) * intval($record['A92']);
                        $sumKER += intval($record['f_vol']) * intval($record['KER']);
                        array_push($reportdata, $recdata);
                        $rownum++;
                    }
                    array_push($reportdata, [$rownum, 'Всего', '',$sumDT, $sumA92, $sumKER]);
                    $xlsx = SimpleXLSXGen::fromArray( $reportdata );
                    $xlsx->saveAs($filepath);
                    //  $xlsx->downloadAs('books.xlsx');
                    return $localfilepath;
                }
                else{
                    return -1;
                }
            }
            catch(Exception $e){
                die($e);
            }
        }

    }

?>
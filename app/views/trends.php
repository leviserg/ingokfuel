<?php  
    if($_SESSION['user']['department']==0){
        require 'trendsallowed.php';
    }
    else{
        echo "<h1 style='text-align: center; margin-top:200px' class='text-info'>Просмотр, к сожалению, запрещен</h1><br/>";
        echo "<p style='text-align: center' class='text-info'><b>Вы можете просмотреть тренды, кликнув на значок резервуара на главной странице</b></p>";
    }
?>
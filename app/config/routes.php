<?php
	$pd = require "prdir.php";
	return [
		$pd              => ['view'  => 'home'      ],
		$pd.'home'		 => ['view'  => 'home'	    ],	
		$pd.'login' 	 => ['view'  => 'login'	    ],
		$pd.'logout' 	 => ['view'  => 'logout'	],
		$pd.'alarms' 	 => ['view'  => 'alarmhist'	], // alarms
		$pd.'events'	 => ['view'  => 'events'	],
		$pd.'trends'	 => ['view'  => 'trends'	],
		$pd.'reports'    => ['view'  => 'reports'   ],					
		$pd.'userhist'   => ['view'  => 'userhist'  ],
		$pd.'driverlist' => ['view'  => 'driverlist'],
		$pd.'localstore' => ['view'  => 'localstore'],
		$pd.'localazs'   => ['view'  => 'localazs'  ],	
		$pd.'localrlw'   => ['view'  => 'localrlw'  ],
		$pd.'localotv'   => ['view'  => 'localotv'  ],	
		$pd.'localprom'  => ['view'  => 'localprom' ]
	];
?>
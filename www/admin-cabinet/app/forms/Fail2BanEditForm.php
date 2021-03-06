<?php
/**
 * Copyright (C) MIKO LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nikolay Beketov, 6 2018
 *
 */

use Phalcon\Forms\Form;
use Phalcon\Forms\Element\Text;
use Phalcon\Forms\Element\Numeric;
use Phalcon\Forms\Element\TextArea;
use Phalcon\Forms\Element\Hidden;
use Phalcon\Forms\Element\Check;


class Fail2BanEditForm extends Form {

	public function initialize( $entity = NULL, $options = NULL ) {
		foreach ( $entity as $key => $value ) {
			switch ( $key ) {
				case "id":
					$this->add( new Hidden( $key ) );
					break;
				case "maxretry":
				case "bantime":
				case "findtime":
				case "***ALL NUMBERIC ABOVE***":
					$this->add( new Numeric( $key ) );
					break;
				case "whitelist":
					$this->add( new TextArea( $key, [ "rows" => 6 ] ) );
					break;
				default:
					$this->add( new Text( $key ) );
			}
		}

		$cheskarr = [ 'value' => NULL ];
		if ( $options['PBXFail2BanEnabled'] === "1" ) {
			$cheskarr = [ 'checked' => 'checked', 'value' => NULL ];
		}
		$this->add( new Check( 'PBXFail2BanEnabled', $cheskarr ) );
	}
}
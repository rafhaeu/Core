<?php
/**
 * Copyright (C) MIKO LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nikolay Beketov, 5 2018
 *
 */

namespace Models;
use Phalcon\Mvc\Model\Relation;

class OutgoingRoutingTable extends ModelsBase
{
    /**
     * @var integer
     */
    public $id;

    /**
     * @var string
     */
    public $rulename;

    /**
     * @var string
     */
    public $providerid;

    /**
     * @var integer
     */
    public $priority;

    /**
     * @var string
     */
    public $numberbeginswith;

    /**
     * @var integer
     */
    public $restnumbers;

    /**
     * @var integer
     */
    public $trimfrombegin;

    /**
     * @var string
     */
    public $prepend;

    /**
     * @var string
     */
    public $note;

    public function getSource() :string
    {
        return 'm_OutgoingRoutingTable';
    }

    public function initialize() :void
    {
	    parent::initialize();
        $this->belongsTo(
            'providerid',
            'Models\Providers',
            'uniqid',
            [
                'alias'      => 'Providers',
                'foreignKey' => [
                    'allowNulls' => false,
                    'action'     => Relation::NO_ACTION,
                ]
            ]
        );
    }
}


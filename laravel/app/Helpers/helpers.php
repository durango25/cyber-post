<?php

if (!function_exists('mapOperator')) {
    function mapOperator(string $value): string
    {
        $operatorMap = [
            'contains' => 'LIKE',
            'is' => '=',
            'equals' => '=',
            '=' => '=',
        ];
        return $operatorMap[$value] ?? '=';
    }
}

<?php

namespace App\Util;

class StringValidation
{
    static public function deleteSpace(string | null $str)
    {
        $str = trim($str);
        $str = preg_replace('/\s+/', ' ', $str);
        return $str;
    }

    static public function deleteSpaceWithoutNewLine(string | null $str) {
        $str = trim($str);
        $str = preg_replace('/[^\S\r\n]+/', ' ', $str);
        return $str;
    }

    static public function replaceByPrefix(string $prefix, string $string) {
        return preg_replace('/^' . preg_quote($prefix, '/') . '/', '', $string);
    }
}

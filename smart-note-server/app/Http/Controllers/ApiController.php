<?php

namespace App\Http\Controllers;

use Response;

class ApiController extends Controller
{
    protected $statusCode = 200;

    public function __construct()
    {
        $this->statusCode = 200;
    }
    
    public function getStatusCode()
    {
        return $this->statusCode;
    }

    public function setStatusCode($statusCode)
    {
        $this->statusCode = $statusCode;
        return $this;
    }

    public function respondWithData($data)
    {
        return response()->json($data, $this->getStatusCode());
    }

    public function respondWithError($message)
    {
        $data = [
            'error'         => true,
            'message'       => $message,
            'status_code'   => $this->getStatusCode()
        ];

        return (Response::json($data))->setStatusCode($this->getStatusCode());
    }

    public function respondWithMessage($message)
    {
        $data = [
            'error'         => false,
            'message'       => $message,
            'status_code'   => $this->getStatusCode()
        ];

        return (Response::json($data))->setStatusCode($this->getStatusCode());
    }

    public function respondNotFound($message = 'Not Found')
    {
        return $this->setStatusCode(404)->respondWithError($message);
    }

    public function respondInternalServerError($message = 'Internal Server Error')
    {
        return $this->setStatusCode(500)->respondWithError($message);
    }

    public function respondUnauthorized($message = 'Unauthorized')
    {
        return $this->setStatusCode(401)->respondWithError($message);
    }

    public function respondForbidden($message = 'Forbidden')
    {
        return $this->setStatusCode(403)->respondWithError($message);
    }

    public function respondBadRequest($message = 'Bad Request')
    {
        return $this->setStatusCode(400)->respondWithError($message);
    }

    public function respondCreated($message = 'Created')
    {
        return $this->setStatusCode(201)->respondWithMessage($message);
    }

    public function respondSuccess($message = 'Success')
    {
        return $this->setStatusCode(200)->respondWithMessage($message);
    }
}

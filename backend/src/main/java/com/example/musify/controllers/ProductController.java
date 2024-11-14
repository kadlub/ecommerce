package com.example.musify.controllers;

import com.example.musify.dto.Products;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {

    @GetMapping
    public List<Products> getAllProdcuts(){
        return Collections.emptyList();
    }

    @PostMapping
    public Products createProduct(@RequestBody Products product){
        return null;
    }
}

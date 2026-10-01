package com.challenge.backend;

import tools.jackson.databind.ObjectMapper;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    public static int requestCount = 0;

    @GetMapping("/{id}")
    public Map<String, Object> getOrder(@PathVariable int id) {
        requestCount++;
        Map<String, Object> result = new HashMap<>();

        try {
            ObjectMapper mapper = new ObjectMapper();
            File file = new File("src/main/resources/data/orders.json");
            List<Map<String, Object>> orders = mapper.readValue(file, List.class);

            for (Map<String, Object> order : orders) {
                if (((Number) order.get("id")).intValue() == id) {
                    List<Map<String, Object>> items = (List<Map<String, Object>>) order.get("items");
                    double subtotal = 0;
                    for (Map<String, Object> item : items) {
                        double unitPrice = ((Number) item.get("unitPrice")).doubleValue();
                        int quantity = ((Number) item.get("quantity")).intValue();
                        subtotal = subtotal + (unitPrice * quantity);
                    }

                    double tax;
                    if (subtotal > 100) {
                        tax = subtotal * 0.21;
                    } else {
                        tax = subtotal * 0.10;
                    }

                    double discount = 0;
                    if (subtotal > 200) {
                        discount = subtotal * 0.05;
                    }

                    double total = subtotal + tax - discount;

                    result.put("id", order.get("id"));
                    result.put("customerName", order.get("customerName"));
                    result.put("status", order.get("status"));
                    result.put("items", items);
                    result.put("subtotal", subtotal);
                    result.put("tax", tax);
                    result.put("discount", discount);
                    result.put("total", total);

                    System.out.println("Order fetched: " + id);
                    return result;
                }
            }
        } catch (Exception e) {
        }

        result.put("error", "Order not found");
        return result;
    }
}


package demo.demo.beans;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import demo.demo.beans.stock.Stock;

@Component
public class PythonScriptScheduler {
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Scheduled(cron = "0 0 0 * * *")  // Runs at 00:00 every day
    public void runPythonScript() {
        try {
            // Python script location
            String pythonScriptPath = "C:\\Fullstack_apps\\stocks-higher-or-lower\\demo\\src\\main\\resources\\python-scripts\\webscraping-yahoo-finance-stocks-data.py";
            String pythonExePath = "C:\\Users\\Danil\\AppData\\Local\\Programs\\Python\\Python312\\python.exe";
            String jsonFilePath = "C:\\Fullstack_apps\\stocks-higher-or-lower\\demo\\src\\main\\resources\\python-scripts\\stocks.json";

            // Execute the script
            ProcessBuilder processBuilder = new ProcessBuilder(pythonExePath, pythonScriptPath);
            processBuilder.redirectErrorStream(true);
            Process process = processBuilder.start();
            
            // Read
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }

            process.waitFor();
            System.out.println("after waiting");

            // String jsonData = output.toString().trim(); 

            List<Stock> stocks = objectMapper.readValue(new File(jsonFilePath), 
                                                          objectMapper.getTypeFactory().constructCollectionType(List.class, Stock.class));

            for (Stock stock : stocks) {
                System.out.println(stock.getCompany() + " - " + stock.getPrice());
            }
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
    }
}
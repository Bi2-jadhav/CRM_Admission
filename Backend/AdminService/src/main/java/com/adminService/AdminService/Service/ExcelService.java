package com.adminService.AdminService.Service;

import com.adminService.AdminService.Entity.Enquiry;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.*;

@Service
public class ExcelService {

    public List<Enquiry> parseExcel(MultipartFile file, Long counselorId) throws Exception {

        List<Enquiry> list = new ArrayList<>();

        Workbook workbook = new XSSFWorkbook(file.getInputStream());
        Sheet sheet = workbook.getSheetAt(0);

        Row headerRow = sheet.getRow(0);
        Map<String, Integer> columnMap = new HashMap<>();

        // ✅ Read headers dynamically
        for (Cell cell : headerRow) {
            columnMap.put(cell.getStringCellValue().toLowerCase().trim(), cell.getColumnIndex());
        }

        for (int i = 1; i <= sheet.getLastRowNum(); i++) {

            Row row = sheet.getRow(i);
            if (row == null) continue;

            Enquiry e = new Enquiry();

            // ✅ SAFE MAPPING (NO CRASH)
            e.setStudentName(getValue(row, columnMap, "student_name"));
            e.setPhone(getValue(row, columnMap, "phone"));
            e.setEmail(getValue(row, columnMap, "email"));

            // 🔥 FIXED HERE (course instead of course_interested)
            e.setCourseInterested(getValue(row, columnMap, "course"));

            e.setSource(getValue(row, columnMap, "source"));
            e.setStage(getValue(row, columnMap, "stage"));
            e.setStatus(getValue(row, columnMap, "status"));

            // ✅ Defaults
            if (e.getStage() == null || e.getStage().isEmpty()) {
                e.setStage("New");
            }

            if (e.getStatus() == null || e.getStatus().isEmpty()) {
                e.setStatus("New");
            }

            e.setAssignedCounselorId(counselorId);
            e.setCreatedDate(LocalDate.now());

            list.add(e);
        }

        workbook.close();
        return list;
    }

    // ✅ SAFE COLUMN READER
    private String getValue(Row row, Map<String, Integer> map, String key) {
        Integer index = map.get(key);
        if (index == null) return ""; // prevents crash
        return getCellValue(row.getCell(index));
    }

    // ✅ CELL VALUE HANDLER
    private String getCellValue(Cell cell) {
        if (cell == null) return "";

        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue().trim();

            case NUMERIC:
                return String.valueOf((long) cell.getNumericCellValue());

            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());

            default:
                return "";
        }
    }
}
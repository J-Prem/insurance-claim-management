package com.insurance.claim.controller.customer;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.insurance.claim.entity.CustomerDocument;
import com.insurance.claim.service.customer.CustomerDocumentService;

@RestController
@RequestMapping("/api/customer/document")
@CrossOrigin("*")
public class CustomerDocumentController {

    private final CustomerDocumentService service;

    public CustomerDocumentController(CustomerDocumentService service) {
        this.service = service;
    }

    // ✅ Upload proof
    @PostMapping(
        value = "/upload",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<String> uploadDocument(
            @RequestParam("type") String documentType,
            @RequestParam("file") MultipartFile file
    ) throws Exception {

        service.uploadDocument(documentType, file);
        return ResponseEntity.ok("Document uploaded successfully");
    }

    // ✅ Download proof
    @GetMapping("/download")
    public ResponseEntity<byte[]> downloadDocument(
            @RequestParam("type") String documentType
    ) {

        CustomerDocument doc = service.getDocument(documentType);

        return ResponseEntity.ok()
                .header(
                    HttpHeaders.CONTENT_DISPOSITION,
                    "attachment; filename=\"" + doc.getFileName() + "\""
                )
                .contentType(MediaType.parseMediaType(doc.getFileType()))
                .body(doc.getDocumentData());
    }
}

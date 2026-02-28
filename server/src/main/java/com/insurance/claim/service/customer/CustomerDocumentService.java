package com.insurance.claim.service.customer;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.insurance.claim.entity.CustomerDocument;
import com.insurance.claim.entity.Users;
import com.insurance.claim.exception.ResourceNotFoundException;
import com.insurance.claim.repository.CustomerDocumentRepository;
import com.insurance.claim.repository.UserRepository;
import com.insurance.claim.security.SecurityUtil;

@Service
public class CustomerDocumentService {

        private final CustomerDocumentRepository documentRepo;
        private final UserRepository userRepo;

        public CustomerDocumentService(
                        CustomerDocumentRepository documentRepo,
                        UserRepository userRepo) {
                this.documentRepo = documentRepo;
                this.userRepo = userRepo;
        }

        // ✅ Upload / Replace document
        @Transactional
        public void uploadDocument(String documentType, MultipartFile file)
                        throws Exception {

                if (file == null || file.isEmpty()) {
                        throw new RuntimeException("File is empty");
                }

                // 🛡️ File Type Validation
                String contentType = file.getContentType();
                if (contentType == null || !(contentType.equals("application/pdf") ||
                                contentType.equals("image/jpeg") || contentType.equals("image/png"))) {
                        throw new RuntimeException("Validation Error: Only PDF, JPG, and PNG files are allowed.");
                }

                // 🛡️ File Size Validation (Max 5MB)
                if (file.getSize() > 5 * 1024 * 1024) {
                        throw new RuntimeException("Validation Error: File size exceeds the 5MB limit.");
                }

                Long customerId = SecurityUtil.getCurrentUserId();

                Users customer = userRepo.findById(customerId)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                CustomerDocument doc = documentRepo
                                .findByCustomerIdAndDocumentType(customerId, documentType.toUpperCase())
                                .orElse(new CustomerDocument());

                doc.setCustomer(customer);
                doc.setDocumentType(documentType.toUpperCase());
                doc.setFileName(file.getOriginalFilename());
                doc.setFileType(file.getContentType());
                doc.setDocumentData(file.getBytes());

                documentRepo.save(doc);
        }

        // ✅ Download document
        @Transactional(readOnly = true)
        public CustomerDocument getDocument(String documentType) {

                Long customerId = SecurityUtil.getCurrentUserId();

                return documentRepo
                                .findByCustomerIdAndDocumentType(
                                                customerId,
                                                documentType.toUpperCase())
                                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));
        }
}

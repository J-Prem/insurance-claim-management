package com.insurance.claim.entity;

import jakarta.persistence.*;

@Entity
@Table(
    name = "customer_document",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"customer_id", "document_type"})
    }
)
public class CustomerDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // CUSTOMER ONLY
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Users customer;

    @Column(name = "document_type", nullable = false)
    private String documentType; // AADHAR / LICENSE / PASSPORT

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String fileType;

    @Lob
    @Basic(fetch = FetchType.EAGER)
    @Column(nullable = false)
    private byte[] documentData;

    // ===== GETTERS & SETTERS =====
    public Long getId() { return id; }

    public Users getCustomer() { return customer; }
    public void setCustomer(Users customer) { this.customer = customer; }

    public String getDocumentType() { return documentType; }
    public void setDocumentType(String documentType) { this.documentType = documentType; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }

    public byte[] getDocumentData() { return documentData; }
    public void setDocumentData(byte[] documentData) { this.documentData = documentData; }
}

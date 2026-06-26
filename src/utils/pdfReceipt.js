import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Generates and downloads a PDF receipt for a single transaction.
 */
export function downloadReceipt(tx, account) {
  const doc = new jsPDF();
  const txId = tx._id || tx.id;

  doc.setFontSize(20);
  doc.setTextColor(18, 26, 40);
  doc.text('Smart Banking', 14, 20);

  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  doc.text('Official Transaction Receipt', 14, 27);

  doc.setDrawColor(220, 220, 220);
  doc.line(14, 31, 196, 31);

  doc.setFontSize(11);
  doc.setTextColor(20, 20, 20);

  const rows = [
    ['Transaction ID', String(txId)],
    ['Date', new Date(tx.date).toLocaleString()],
    ['Account Holder', account?.holderName || '-'],
    ['Account Number', tx.accountNo],
    ['Transaction Type', tx.type],
    ['Amount', `Rs. ${Number(tx.amount).toFixed(2)}`],
    ['Related Account', tx.toAccount || '-'],
    ['Balance After Transaction', `Rs. ${Number(tx.balanceAfter).toFixed(2)}`]
  ];

  autoTable(doc, {
    startY: 38,
    head: [['Field', 'Details']],
    body: rows,
    theme: 'grid',
    headStyles: { fillColor: [18, 26, 40] },
    styles: { fontSize: 10 }
  });

  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(
    'This is a system-generated receipt from Smart Banking (demo app, no real funds).',
    14,
    doc.lastAutoTable.finalY + 12
  );

  doc.save(`receipt-${txId}.pdf`);
}

/**
 * Generates a full transaction-history PDF report for an account.
 */
export function downloadHistoryReport(account, transactions) {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.setTextColor(18, 26, 40);
  doc.text('Smart Banking - Statement', 14, 18);

  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  doc.text(`Account Holder: ${account.holderName}`, 14, 27);
  doc.text(`Account No: ${account.accountNo}`, 14, 33);
  doc.text(`Current Balance: Rs. ${Number(account.balance).toFixed(2)}`, 14, 39);

  autoTable(doc, {
    startY: 45,
    head: [['Date', 'Type', 'Amount', 'Related A/C', 'Balance After']],
    body: transactions.map((t) => [
      new Date(t.date).toLocaleString(),
      t.type,
      `Rs. ${Number(t.amount).toFixed(2)}`,
      t.toAccount || '-',
      `Rs. ${Number(t.balanceAfter).toFixed(2)}`
    ]),
    theme: 'striped',
    headStyles: { fillColor: [18, 26, 40] },
    styles: { fontSize: 9 }
  });

  doc.save(`statement-${account.accountNo}.pdf`);
}

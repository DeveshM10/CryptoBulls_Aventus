{/* Assuming this is within a larger component */}
<Dialog open={open} onClose={handleClose}>
  <DialogTitle>Form Title</DialogTitle>
  <DialogContent className="sm:max-w-[425px] max-h-[60vh] overflow-y-auto pr-2">
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
      {/* Your form fields */}
      <TextField
        autoFocus
        margin="dense"
        id="name"
        label="Name"
        type="text"
        fullWidth
        variant="standard"
      />
      {/* More form fields as needed */}
    </form>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose}>Cancel</Button>
    <Button onClick={handleSubmit}>Submit</Button>
  </DialogActions>
</Dialog>
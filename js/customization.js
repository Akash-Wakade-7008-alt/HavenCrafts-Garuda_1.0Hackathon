/* =========================================
   HAVENCRAFT — CUSTOMIZATION ENGINE
   customization.js
   
   Public API:
     HC_Cust.open(productId, productName)
     HC_Cust.save()
     HC_Cust.load(productId)
     HC_Cust.remove(productId)
     HC_Cust.getAll()
     HC_Cust.attachToCartItem(productId, cartItem)
     HC_Cust.refreshCardUI(productId)
========================================= */

const HC_Cust = (() => {
  /* ─── Constants ─── */
  const STORAGE_KEY = 'hc_customizations';
  const MAX_IMG_BYTES = 2 * 1024 * 1024; // 2 MB
  const MODAL_ID = 'hcCustModal';

  let _activeProductId = null;
  let _activeProductName = null;
  let _pendingBase64Image = null; // Holds base64 before save

  /* ─── 1. localStorage helpers ─── */
  function getAll() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch { return {}; }
  }

  function load(productId) {
    return getAll()[productId] || null;
  }

  function _write(productId, data) {
    const all = getAll();
    all[productId] = data;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }

  function remove(productId) {
    const all = getAll();
    delete all[productId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    refreshCardUI(productId);
    _showToast('Customization removed 🗑️');
  }

  /* ─── 2. Modal HTML ─── */
  function _getModalHTML() {
    return `
    <div id="${MODAL_ID}" class="hc-cust-overlay" role="dialog" aria-modal="true" aria-labelledby="hcCustTitle">
      <div class="hc-cust-modal" role="document">
        <!-- Header -->
        <div class="hc-cust-header">
          <h2 class="hc-cust-title" id="hcCustTitle">Customize Product</h2>
          <button class="hc-cust-close" id="hcCustClose" aria-label="Close customization modal">✕</button>
        </div>

        <!-- Enable Toggle -->
        <div class="hc-cust-enable-row">
          <label class="hc-cust-toggle-label" for="hcEnableCb">
            <input type="checkbox" id="hcEnableCb" class="hc-cust-enable-cb">
            <span class="hc-cust-toggle-track"><span class="hc-cust-toggle-thumb"></span></span>
            <span class="hc-cust-toggle-text">Enable Customization</span>
          </label>
        </div>

        <!-- Form fields (disabled until checkbox checked) -->
        <div class="hc-cust-fields disabled" id="hcCustFields">
          <!-- Name -->
          <div class="hc-cust-field-group">
            <label class="hc-cust-label" for="hcCustName">Name <span class="hc-cust-required">*</span></label>
            <input
              type="text"
              id="hcCustName"
              class="hc-cust-input"
              placeholder="Your name will appear here (min 2 chars)"
              disabled
              maxlength="80"
              autocomplete="off"
            />
            <span class="hc-cust-error" id="hcNameErr">Name is required (min 2 characters)</span>
          </div>

          <!-- Image Upload -->
          <div class="hc-cust-field-group">
            <label class="hc-cust-label" for="hcCustImage">Upload Image <span class="hc-cust-optional">(optional · max 2MB)</span></label>
            <div class="hc-cust-upload-row">
              <label class="hc-cust-upload-btn" for="hcCustImage" id="hcUploadLabel">
                📁 Choose File
              </label>
              <input
                type="file"
                id="hcCustImage"
                class="hc-cust-file-hidden"
                accept="image/*"
                disabled
              />
              <button class="hc-cust-remove-img" id="hcRemoveImg" type="button" style="display:none">✕ Remove</button>
            </div>
            <span class="hc-cust-error" id="hcImgErr">Image exceeds 2MB limit. Please choose a smaller file.</span>
            <!-- Preview -->
            <div class="hc-cust-preview-wrap" id="hcImgPreviewWrap" style="display:none">
              <img id="hcImgPreview" class="hc-cust-preview-img" src="" alt="Image preview" />
            </div>
          </div>

          <!-- Description -->
          <div class="hc-cust-field-group">
            <label class="hc-cust-label" for="hcCustDesc">Description <span class="hc-cust-optional">(optional)</span></label>
            <textarea
              id="hcCustDesc"
              class="hc-cust-textarea"
              placeholder="Add notes, engraving text, special instructions… (max 200 chars)"
              rows="3"
              maxlength="200"
              disabled
            ></textarea>
            <div class="hc-cust-char-row">
              <span class="hc-cust-error" id="hcDescErr">Description must be 200 characters or fewer</span>
              <span class="hc-cust-char-count" id="hcDescCount">0 / 200</span>
            </div>
          </div>
        </div>

        <!-- Confirm checkbox -->
        <label class="hc-cust-confirm-label" id="hcConfirmRow" style="display:none">
          <input type="checkbox" id="hcConfirmCb">
          <span>I confirm and accept all the above customization changes</span>
        </label>
        <span class="hc-cust-error" id="hcConfirmErr" style="padding:0 24px 4px;">Please check the confirmation box before saving</span>

        <!-- Footer Actions -->
        <div class="hc-cust-footer">
          <button class="hc-cust-btn-danger" id="hcRemoveCustBtn" type="button" style="display:none">🗑️ Remove</button>
          <div class="hc-cust-footer-right">
            <button class="hc-cust-btn-cancel" id="hcCancelBtn" type="button">Cancel</button>
            <button class="hc-cust-btn-save" id="hcSaveBtn" type="button" disabled>
                <span class="hc-cust-save-text">Save Customization ✓</span>
                <span class="hc-cust-loader" style="display:none;"></span>
            </button>
          </div>
        </div>
      </div>
    </div>`;
  }

  /* ─── 3. CSS Injection ─── */
  function _injectStyles() {
    if (document.getElementById('hcCustStyles')) return;
    const style = document.createElement('style');
    style.id = 'hcCustStyles';
    style.textContent = `
      /* ── Overlay ── */
      .hc-cust-overlay {
        position: fixed; inset: 0; z-index: 9000;
        background: rgba(20, 20, 20, 0.65);
        backdrop-filter: blur(8px);
        display: flex; align-items: center; justify-content: center;
        padding: 16px;
        opacity: 0; pointer-events: none;
        transition: opacity 0.3s ease;
      }
      .hc-cust-overlay.open {
        opacity: 1; pointer-events: all;
      }

      /* ── Modal ── */
      .hc-cust-modal {
        background: #fffcf8;
        border-radius: 20px;
        width: 100%; max-width: 520px;
        max-height: 90vh; overflow-y: auto;
        box-shadow: 0 24px 64px rgba(0,0,0,0.22);
        transform: scale(0.94) translateY(12px);
        transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
        font-family: 'DM Sans', sans-serif;
        scrollbar-width: thin;
        scrollbar-color: #d0c8be transparent;
      }
      .hc-cust-overlay.open .hc-cust-modal {
        transform: scale(1) translateY(0);
      }

      /* ── Header ── */
      .hc-cust-header {
        display: flex; align-items: center; justify-content: space-between;
        padding: 22px 24px 16px;
        border-bottom: 1px solid #e8e0d5;
        position: sticky; top: 0; background: #fffcf8; z-index: 1;
      }
      .hc-cust-title {
        font-family: 'Cormorant Garamond', serif;
        font-size: 1.5rem; font-weight: 600;
        color: #2c2c2c; margin: 0;
      }
      .hc-cust-close {
        background: none; border: none; font-size: 1.1rem;
        cursor: pointer; color: #8a8a8a; width: 32px; height: 32px;
        border-radius: 50%; display: flex; align-items: center; justify-content: center;
        transition: background 0.2s, color 0.2s;
      }
      .hc-cust-close:hover { background: #f2ebe0; color: #2c2c2c; }

      /* ── Enable Toggle Row ── */
      .hc-cust-enable-row {
        padding: 18px 24px;
        border-bottom: 1px solid #f0e8de;
        background: #faf7f2;
      }
      .hc-cust-toggle-label {
        display: flex; align-items: center; gap: 12px; cursor: pointer;
      }
      .hc-cust-enable-cb { display: none; }
      .hc-cust-toggle-track {
        width: 44px; height: 24px; border-radius: 24px;
        background: #d0c8be; position: relative;
        transition: background 0.3s; flex-shrink: 0;
      }
      .hc-cust-enable-cb:checked ~ .hc-cust-toggle-track {
        background: #8aad8f;
      }
      .hc-cust-toggle-thumb {
        position: absolute; width: 18px; height: 18px; border-radius: 50%;
        background: #fff; top: 3px; left: 3px;
        box-shadow: 0 1px 4px rgba(0,0,0,0.2);
        transition: left 0.3s;
      }
      .hc-cust-enable-cb:checked ~ .hc-cust-toggle-track .hc-cust-toggle-thumb {
        left: 23px;
      }
      .hc-cust-toggle-text {
        font-size: 0.95rem; font-weight: 500; color: #2c2c2c;
      }

      /* ── Fields ── */
      .hc-cust-fields {
        padding: 20px 24px; display: flex; flex-direction: column; gap: 20px;
        transition: opacity 0.3s ease;
      }
      .hc-cust-fields.disabled {
        opacity: 0.45;
        pointer-events: none;
      }
      .hc-cust-field-group { display: flex; flex-direction: column; gap: 6px; }
      .hc-cust-label {
        font-size: 0.88rem; font-weight: 600; color: #5a5a5a;
        letter-spacing: 0.02em;
      }
      .hc-cust-required { color: #d4907e; margin-left: 2px; }
      .hc-cust-optional { font-weight: 400; color: #8a8a8a; font-size: 0.82rem; }

      .hc-cust-input, .hc-cust-textarea {
        width: 100%; padding: 11px 14px;
        border: 1.5px solid #e8e0d5; border-radius: 10px;
        font-family: 'DM Sans', sans-serif; font-size: 0.92rem;
        background: #faf7f2; color: #2c2c2c;
        outline: none; transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
        resize: none;
      }
      .hc-cust-input:focus, .hc-cust-textarea:focus {
        border-color: #8aad8f;
        background: #fff;
        box-shadow: 0 0 0 4px rgba(138,173,143,0.15);
      }
      .hc-cust-input:disabled, .hc-cust-textarea:disabled {
        background: #f2ebe0; color: #aaa; cursor: not-allowed;
        border-color: #e8e0d5;
      }
      .hc-cust-input.error, .hc-cust-textarea.error {
        border-color: #d4907e !important;
        box-shadow: 0 0 0 4px rgba(212,144,126,0.15);
      }

      /* ── File Upload ── */
      .hc-cust-file-hidden { display: none; }
      .hc-cust-upload-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
      .hc-cust-upload-btn {
        display: inline-flex; align-items: center; gap: 6px;
        padding: 9px 16px; border-radius: 50px;
        border: 1.5px solid #e8e0d5; background: #faf7f2;
        font-size: 0.88rem; font-weight: 500; cursor: pointer; color: #5a5a5a;
        transition: all 0.2s; white-space: nowrap;
      }
      .hc-cust-upload-btn:hover { border-color: #8aad8f; color: #5e8363; background: rgba(138,173,143,0.06); }
      .hc-cust-remove-img {
        padding: 8px 14px; border-radius: 50px; border: 1.5px solid #e8e0d5;
        background: none; font-size: 0.82rem; cursor: pointer; color: #d4907e;
        transition: all 0.2s;
      }
      .hc-cust-remove-img:hover { background: rgba(212,144,126,0.08); border-color: #d4907e; }

      /* ── Image Preview ── */
      .hc-cust-preview-wrap {
        margin-top: 10px; border-radius: 10px; overflow: hidden;
        border: 1.5px solid #e8e0d5; background: #faf7f2;
        max-height: 180px; display: flex; align-items: center; justify-content: center;
      }
      .hc-cust-preview-img {
        max-width: 100%; max-height: 180px; object-fit: contain; display: block;
      }

      /* ── Char count ── */
      .hc-cust-char-row { display: flex; justify-content: space-between; align-items: flex-start; }
      .hc-cust-char-count { font-size: 0.78rem; color: #8a8a8a; white-space: nowrap; padding-top: 2px; }

      /* ── Errors ── */
      .hc-cust-error {
        font-size: 0.8rem; color: #d4907e; font-weight: 500;
        display: none; margin-top: 2px;
      }
      .hc-cust-error.visible { display: block; }

      /* ── Confirm Row ── */
      .hc-cust-confirm-label {
        display: flex; align-items: flex-start; gap: 10px; cursor: pointer;
        padding: 0 24px 16px;
        font-size: 0.87rem; color: #5a5a5a; line-height: 1.5;
      }
      .hc-cust-confirm-label input[type="checkbox"] {
        margin-top: 3px; accent-color: #8aad8f; flex-shrink: 0; cursor: pointer;
      }

      /* ── Footer ── */
      .hc-cust-footer {
        padding: 16px 24px 22px;
        border-top: 1px solid #e8e0d5;
        display: flex; align-items: center; justify-content: space-between; gap: 12px;
      }
      .hc-cust-footer-right { display: flex; gap: 10px; margin-left: auto; }
      .hc-cust-btn-cancel {
        padding: 10px 20px; border-radius: 50px;
        border: 1.5px solid #e8e0d5; background: transparent;
        font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 500;
        cursor: pointer; color: #5a5a5a; transition: all 0.2s;
      }
      .hc-cust-btn-cancel:hover { border-color: #8aad8f; color: #5e8363; }
      .hc-cust-btn-save {
        padding: 10px 22px; border-radius: 50px; border: none;
        background: linear-gradient(135deg, #8aad8f, #5e8363);
        color: #fff; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 600;
        cursor: pointer; box-shadow: 0 4px 12px rgba(94,131,99,0.35);
        transition: all 0.25s;
        min-width: 160px;
        display: inline-flex; justify-content: center; align-items: center; gap: 8px;
        position: relative; overflow: hidden;
      }
      .hc-cust-btn-save:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(94,131,99,0.45); }
      .hc-cust-btn-save:disabled { background: #c0ccc0; box-shadow: none; cursor: not-allowed; opacity: 0.7; }
      .hc-cust-loader {
        width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.4);
        border-top-color: #fff; border-radius: 50%;
        animation: hcSpin 0.8s linear infinite;
      }
      @keyframes hcSpin { 100% { transform: rotate(360deg); } }
      .hc-cust-btn-danger {
        padding: 10px 18px; border-radius: 50px;
        border: 1.5px solid #e8e0d5; background: transparent;
        font-family: 'DM Sans', sans-serif; font-size: 0.88rem; font-weight: 500;
        cursor: pointer; color: #d4907e; transition: all 0.2s;
      }
      .hc-cust-btn-danger:hover { background: rgba(212,144,126,0.08); border-color: #d4907e; }

      /* ── Card Badge ── */
      .hc-cust-badge {
        position: absolute; top: 8px; left: 8px; z-index: 5;
        background: rgba(255,252,248,0.95);
        color: #5e8363; font-size: 0.68rem; font-weight: 700;
        padding: 3px 8px; border-radius: 50px;
        border: 1px solid rgba(138,173,143,0.5);
        backdrop-filter: blur(4px);
        box-shadow: 0 2px 6px rgba(0,0,0,0.06);
        pointer-events: none;
        letter-spacing: 0.02em;
      }

      /* ── Responsive ── */
      @media (max-width: 576px) {
        .hc-cust-modal { border-radius: 16px; }
        .hc-cust-footer { flex-direction: column; }
        .hc-cust-footer-right { width: 100%; justify-content: flex-end; }
        .hc-cust-btn-save, .hc-cust-btn-cancel { flex: 1; justify-content: center; }
      }
    `;
    document.head.appendChild(style);
  }

  /* ─── 4. Build/Get Modal DOM ─── */
  function _ensureModal() {
    if (document.getElementById(MODAL_ID)) return;
    _injectStyles();
    document.body.insertAdjacentHTML('beforeend', _getModalHTML());
    _bindModalEvents();
  }

  /* ─── 5. Event Wiring ─── */
  function _bindModalEvents() {
    const overlay = document.getElementById(MODAL_ID);
    const enableCb = document.getElementById('hcEnableCb');
    const nameInput = document.getElementById('hcCustName');
    const imageInput = document.getElementById('hcCustImage');
    const descArea = document.getElementById('hcCustDesc');
    const saveBtn = document.getElementById('hcSaveBtn');
    const confirmRow = document.getElementById('hcConfirmRow');
    const confirmCb = document.getElementById('hcConfirmCb');
    const removeImgBtn = document.getElementById('hcRemoveImg');
    const removeCustBtn = document.getElementById('hcRemoveCustBtn');

    // Close via overlay click
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

    // Close buttons
    document.getElementById('hcCustClose').addEventListener('click', close);
    document.getElementById('hcCancelBtn').addEventListener('click', close);

    // ESC key
    document.addEventListener('keydown', _handleKeyDown);

    // Enable checkbox toggle
    enableCb.addEventListener('change', function () {
      const enabled = this.checked;
      const fieldsContainer = document.getElementById('hcCustFields');
      if (enabled) {
        fieldsContainer.classList.remove('disabled');
      } else {
        fieldsContainer.classList.add('disabled');
      }
      [nameInput, imageInput, descArea].forEach(el => el.disabled = !enabled);
      confirmRow.style.display = enabled ? 'flex' : 'none';
      saveBtn.disabled = !enabled;

      if (!enabled) {
        // Reset errors
        _clearErrors();
        confirmCb.checked = false;
        saveBtn.disabled = true;
      } else {
        // Active save button requirement
        saveBtn.disabled = !confirmCb.checked;
        setTimeout(() => nameInput.focus(), 50);
      }
    });

    // Name validation on blur
    nameInput.addEventListener('input', () => _validateName(false));
    nameInput.addEventListener('blur', () => _validateName(true));

    // Description char counter
    descArea.addEventListener('input', () => {
      const len = descArea.value.length;
      document.getElementById('hcDescCount').textContent = `${len} / 200`;
      _setError('hcDescErr', len > 200);
      if (len > 200) descArea.classList.add('error'); else descArea.classList.remove('error');
    });

    // Image handling
    imageInput.addEventListener('change', _handleImageChange);

    // Remove image
    removeImgBtn.addEventListener('click', _clearImage);

    // Confirm checkbox controls save button enabling
    confirmCb.addEventListener('change', function () {
      saveBtn.disabled = !this.checked;
    });

    // Remove customization
    removeCustBtn.addEventListener('click', () => {
      if (_activeProductId) remove(_activeProductId);
      close();
    });

    // Save
    saveBtn.addEventListener('click', save);
  }

  function _handleKeyDown(e) {
    if (e.key === 'Escape') {
      const overlay = document.getElementById(MODAL_ID);
      if (overlay && overlay.classList.contains('open')) close();
    }
    // Focus trap
    if (e.key === 'Tab') {
      const overlay = document.getElementById(MODAL_ID);
      if (!overlay || !overlay.classList.contains('open')) return;
      const focusable = overlay.querySelectorAll('input, textarea, button, [tabindex]:not([tabindex="-1"])');
      const first = focusable[0]; const last = focusable[focusable.length - 1];
      if (e.shiftKey) { if (document.activeElement === first) { last.focus(); e.preventDefault(); } }
      else { if (document.activeElement === last) { first.focus(); e.preventDefault(); } }
    }
  }

  /* ─── 6. Image Handling ─── */
  function _handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > MAX_IMG_BYTES) {
      _setError('hcImgErr', true);
      _clearImage();
      return;
    }
    _setError('hcImgErr', false);
    const reader = new FileReader();
    reader.onload = ev => {
      _pendingBase64Image = ev.target.result;
      document.getElementById('hcImgPreview').src = _pendingBase64Image;
      document.getElementById('hcImgPreviewWrap').style.display = 'flex';
      document.getElementById('hcRemoveImg').style.display = 'inline-flex';
      
      let fName = file.name;
      if (fName.length > 20) fName = fName.substring(0, 20) + '...';
      document.getElementById('hcUploadLabel').textContent = `✅ ${fName}`;
    };
    reader.readAsDataURL(file);
  }

  function _clearImage() {
    _pendingBase64Image = null;
    const imgInput = document.getElementById('hcCustImage');
    if (imgInput) imgInput.value = '';
    const previewWrap = document.getElementById('hcImgPreviewWrap');
    if (previewWrap) previewWrap.style.display = 'none';
    const removeBtn = document.getElementById('hcRemoveImg');
    if (removeBtn) removeBtn.style.display = 'none';
    const uploadLabel = document.getElementById('hcUploadLabel');
    if (uploadLabel) uploadLabel.textContent = '📁 Choose File';
    _setError('hcImgErr', false);
  }

  /* ─── 7. Validation ─── */
  function _validateName(showError) {
    const val = document.getElementById('hcCustName').value.trim();
    const invalid = val.length < 2;
    if (showError || val.length > 0) {
      _setError('hcNameErr', invalid);
      document.getElementById('hcCustName').classList.toggle('error', invalid);
    }
    return !invalid;
  }

  function _validateAll() {
    const enabledCb = document.getElementById('hcEnableCb');
    if (!enabledCb.checked) return false;
    let valid = true;
    if (!_validateName(true)) valid = false;
    const desc = document.getElementById('hcCustDesc').value;
    if (desc.length > 200) { _setError('hcDescErr', true); valid = false; }
    if (!document.getElementById('hcConfirmCb').checked) {
      _setError('hcConfirmErr', true); valid = false;
    } else { _setError('hcConfirmErr', false); }
    return valid;
  }

  function _setError(id, show) {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('visible', show);
  }

  function _clearErrors() {
    ['hcNameErr', 'hcImgErr', 'hcDescErr', 'hcConfirmErr'].forEach(id => _setError(id, false));
    ['hcCustName', 'hcCustDesc'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('error');
    });
  }

  /* ─── 8. Open Modal ─── */
  function open(productId, productName) {
    _ensureModal();
    _activeProductId = productId;
    _activeProductName = productName || productId;
    _pendingBase64Image = null;

    // Update title
    document.getElementById('hcCustTitle').textContent = `Customize: ${_activeProductName}`;

    // Reset form
    const enableCb = document.getElementById('hcEnableCb');
    enableCb.checked = false;
    document.getElementById('hcCustFields').classList.add('disabled');
    ['hcCustName', 'hcCustDesc'].forEach(id => {
      const el = document.getElementById(id); if (el) { el.value = ''; el.disabled = true; el.classList.remove('error'); }
    });
    document.getElementById('hcCustImage').disabled = true;
    document.getElementById('hcConfirmCb').checked = false;
    document.getElementById('hcSaveBtn').disabled = true;
    document.getElementById('hcConfirmRow').style.display = 'none';
    document.getElementById('hcDescCount').textContent = '0 / 200';
    _clearImage();
    _clearErrors();

    // Prefill if existing
    const existing = load(productId);
    if (existing && existing.isCustomized) {
      enableCb.checked = true;
      enableCb.dispatchEvent(new Event('change')); // trigger enable logic
      document.getElementById('hcCustName').value = existing.name || '';
      document.getElementById('hcCustDesc').value = existing.description || '';
      const descLen = (existing.description || '').length;
      document.getElementById('hcDescCount').textContent = `${descLen} / 200`;
      if (existing.image) {
        _pendingBase64Image = existing.image;
        document.getElementById('hcImgPreview').src = existing.image;
        document.getElementById('hcImgPreviewWrap').style.display = 'flex';
        document.getElementById('hcRemoveImg').style.display = 'inline-flex';
        document.getElementById('hcUploadLabel').textContent = '✅ Image saved';
      }
      document.getElementById('hcRemoveCustBtn').style.display = 'inline-flex';
      document.getElementById('hcSaveBtn').disabled = true; // still need confirm
    } else {
      document.getElementById('hcRemoveCustBtn').style.display = 'none';
    }

    // Show modal
    const overlay = document.getElementById(MODAL_ID);
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Focus first focusable element
    setTimeout(() => {
      const first = overlay.querySelector('button, input, textarea');
      if (first) first.focus();
    }, 100);
  }

  /* ─── 9. Close Modal ─── */
  function close() {
    const overlay = document.getElementById(MODAL_ID);
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
    _pendingBase64Image = null;
  }

  /* ─── 10. Save ─── */
  function save() {
    if (!_validateAll()) return;

    const saveBtn = document.getElementById('hcSaveBtn');
    const loader = saveBtn.querySelector('.hc-cust-loader');
    const textSpan = saveBtn.querySelector('.hc-cust-save-text');
    
    saveBtn.disabled = true;
    if (loader) loader.style.display = 'inline-block';
    if (textSpan) textSpan.style.display = 'none';

    setTimeout(() => {
        const name = document.getElementById('hcCustName').value.trim();
        const description = document.getElementById('hcCustDesc').value.trim();
        const image = _pendingBase64Image || (load(_activeProductId) || {}).image || null;

        const data = {
          name,
          description,
          image,
          isCustomized: true,
          updatedAt: Date.now()
        };

        _write(_activeProductId, data);
        close();
        _showToast('Customization Saved ✅');
        refreshCardUI(_activeProductId);

        // Also update cart items for this product
        _syncCartCustomization(_activeProductId, data);

        // Restore button state
        saveBtn.disabled = false;
        if (loader) loader.style.display = 'none';
        if (textSpan) textSpan.style.display = 'inline-block';
    }, 600); // Simulate brief network/save delay
  }

  /* ─── 11. Sync Cart ─── */
  function _syncCartCustomization(productId, custData) {
    try {
      const cartItems = JSON.parse(localStorage.getItem('hc_cart_items') || '[]');
      let changed = false;
      cartItems.forEach(item => {
        if (item.id === productId) {
          item.customization = custData.name + (custData.description ? ` — ${custData.description}` : '');
          item.customizationImage = custData.image;
          changed = true;
        }
      });
      if (changed) localStorage.setItem('hc_cart_items', JSON.stringify(cartItems));
    } catch {}
  }

  /* ─── 12. Attach to Cart Item ─── */
  function attachToCartItem(productId, cartItem) {
    const cust = load(productId);
    if (!cust || !cust.isCustomized) return cartItem;
    return {
      ...cartItem,
      customization: cust.name + (cust.description ? ` — ${cust.description}` : ''),
      customizationImage: cust.image
    };
  }

  /* ─── 13. Refresh Card UI ─── */
  function refreshCardUI(productId) {
    const cust = load(productId);
    const isCustomized = cust && cust.isCustomized;

    // Find card element(s) with matching data-id
    document.querySelectorAll(`[data-product-id="${productId}"]`).forEach(card => {
      // Badge
      let badge = card.querySelector('.hc-cust-badge');
      if (isCustomized) {
        if (!badge) {
          badge = document.createElement('span');
          badge.className = 'hc-cust-badge';
          // Make sure the card has position: relative
          card.style.position = card.style.position || 'relative';
          card.insertAdjacentElement('afterbegin', badge);
        }
        badge.textContent = 'Customized ✅';
      } else {
        if (badge) badge.remove();
      }

      // Button text
      const custBtn = card.querySelector('.cust-btn, .btn-cust, [data-cust-btn]');
      if (custBtn) {
        custBtn.textContent = isCustomized ? '✏️ Edit Customization' : '✏️ Customize';
      }
    });
  }

  /* ─── 14. Toast helper (fallback if showToast not global) ─── */
  function _showToast(msg) {
    if (typeof showToast === 'function') { showToast(msg); return; }
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.style.cssText = 'position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(60px);background:#2c2c2c;color:#fff;padding:10px 22px;border-radius:50px;font-size:0.9rem;z-index:99999;opacity:0;transition:all 0.35s;pointer-events:none;';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    clearTimeout(toast._tid);
    toast._tid = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(60px)';
    }, 2800);
  }

  /* ─── Public API ─── */
  return { open, close, save, load, remove, getAll, refreshCardUI, attachToCartItem };
})();
